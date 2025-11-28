import { BulletList, ListItem } from "@tiptap/extension-list";
import { Editor, JSONContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Mention, { MentionNodeAttrs } from "@tiptap/extension-mention";
import { atom, useSetAtom } from "jotai";
import {
  IngredientSelectorPopover,
  IngredientsPopoverElement,
} from "./IngredientSelectorPopover";
import { useMemo, useRef, useState } from "react";
import { IngredientRef } from "../../data/models";

type JsonDocument = ReturnType<Editor["getJSON"]>;

type ClosedMentionState = {
  isOpen: false;
};
type OpenedMentionState = {
  isOpen: true;
  positon: DOMRect;
  query: string;
  // onKeyDown: (event: KeyboardEvent) => boolean;
  onSelected: (item: MentionNodeAttrs) => void;
};

type MentionState = OpenedMentionState | ClosedMentionState;

type Props = {
  initialContent: string;
  readonly: boolean;
  onChange: (content: string, ingredientRefs: IngredientRef[]) => void;
  quantityMultiplier: number;
};

const CustomMention = Mention.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => ({
          "data-id": attributes.id,
        }),
      },
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-name"),
        renderHTML: (attributes) => ({
          "data-name": attributes.name,
        }),
      },
      quantity: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-quantity"),
        renderHTML: (attributes) => ({
          "data-quantity": attributes.quantity,
        }),
      },
      unit: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-unit"),
        renderHTML: (attributes) => ({
          "data-unit": attributes.unit,
        }),
      },
    };
  },
});

export const localIngredientsAtom = atom<IngredientRef[]>([]);

const tryParseJson = (content: string) => {
  try {
    return JSON.parse(content) as JsonDocument;
  } catch {
    return null;
  }
};

export const RecipeEditor = ({
  initialContent,
  onChange,
  readonly,
  quantityMultiplier,
}: Props) => {
  const [mentionsState, setMentionsState] = useState<MentionState>({
    isOpen: false,
  });
  const mentionsPopoverRef = useRef<IngredientsPopoverElement>(null);
  const setLocalIngredients = useSetAtom(localIngredientsAtom);
  const editorRef = useRef<HTMLDivElement>(null);
  const [jsonContent, setJsonContent] = useState(() =>
    tryParseJson(initialContent)
  );

  const convertedJson = useMemo(
    () => jsonContent && convertRecipe(jsonContent, quantityMultiplier),
    [jsonContent, readonly, quantityMultiplier]
  );

  useEditor(
    {
      element: editorRef.current,
      editable: !readonly,
      editorProps: {
        attributes: {
          class: "grow",
        },
      },
      extensions: [
        Document,
        Text,
        Paragraph,
        BulletList,
        ListItem,
        Heading.configure({
          levels: [1, 2],
        }),
        HorizontalRule,
        CustomMention.configure({
          HTMLAttributes: {
            class: "mention",
          },
          suggestion: {
            char: "@",
            allowSpaces: true,
            render: () => {
              return {
                onStart: (props) => {
                  const clientRect = props.clientRect?.();
                  if (!clientRect) return;
                  setMentionsState({
                    isOpen: true,
                    positon: clientRect,
                    query: props.query,
                    onSelected: props.command,
                  });
                },
                onKeyDown: (props) => {
                  if (!mentionsPopoverRef.current) return true;
                  return mentionsPopoverRef.current.onKeyDown(props.event);
                },
                onUpdate: (props) => {
                  const clientRect = props.clientRect?.();
                  if (!clientRect) return;
                  setMentionsState({
                    isOpen: true,
                    positon: clientRect,
                    query: props.query,
                    onSelected: props.command,
                  });
                },
                onExit: () => {
                  setMentionsState({ isOpen: false });
                },
              };
            },
          },
        }),
      ],
      content: readonly ? convertedJson : jsonContent,
      onUpdate: ({ editor, transaction }) => {
        if (!transaction.docChanged || readonly) return;
        const json = editor.getJSON();
        const jsonString = JSON.stringify(json);
        console.log("JSON:", editor.getJSON());

        if (jsonString === JSON.stringify(jsonContent)) return;
        // Parse all mentions from the editor
        const ingredientRefs = new Map<string, IngredientRef>();

        editor.state.doc.descendants((node) => {
          const ingredientData = getIngredientRef(node.attrs);
          if (node.type.name === "mention" && !!ingredientData) {
            const total = ingredientRefs.get(ingredientData.id)?.quantity ?? 0;
            ingredientRefs.set(ingredientData.id, {
              id: node.attrs.id,
              name: node.attrs.name,
              quantity: total + ingredientData.quantity,
              unit: node.attrs.unit,
            });
          }
        });

        const ingredientRefsArray = Array.from(ingredientRefs.values());

        setLocalIngredients(ingredientRefsArray);
        setJsonContent(json);
        onChange(jsonString, ingredientRefsArray);
      },
    },
    [readonly, quantityMultiplier]
  );

  return (
    <>
      <div ref={editorRef} className="grow flex flex-col" />
      {mentionsState.isOpen ? (
        <IngredientSelectorPopover
          ref={mentionsPopoverRef}
          position={mentionsState.positon}
          query={mentionsState.query}
          onSelected={mentionsState.onSelected}
        />
      ) : null}
    </>
  );
};

const convertRecipe = (
  content: JSONContent,
  multiplier: number
): JSONContent => {
  const newNode = { ...content };
  if (content.type === "mention") {
    // needs to be converted
    const ingredient = content.attrs
      ? getIngredientRef(content.attrs)
      : undefined;
    if (ingredient && newNode.attrs) {
      newNode.attrs = {
        ...newNode.attrs,
        label: `${ingredient.quantity * multiplier}${ingredient.unit} ${ingredient.name}`,
      };
    }
  }

  if (newNode.content)
    newNode.content = newNode.content.map((c) => convertRecipe(c, multiplier));

  return newNode;
};

const getIngredientRef = (
  nodeAttrs: Record<string, any>
): IngredientRef | undefined => {
  const quantity = nodeAttrs["quantity"] as number;
  const unit = nodeAttrs["unit"] as string;
  const name = nodeAttrs["name"] as string;
  const id = nodeAttrs["id"] as string;
  if (!quantity || !unit || !name || !id) return undefined;

  return {
    id,
    name,
    quantity,
    unit,
  };
};
