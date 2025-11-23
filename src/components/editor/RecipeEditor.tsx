import { BulletList, ListItem } from "@tiptap/extension-list";
import { useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Mention from "@tiptap/extension-mention";
import { atom, Provider, useAtom, useSetAtom } from "jotai";
import {
  IngredientSelectorPopover,
  mentionsAtom,
} from "./IngredientSelectorPopover";
import { useEffect, useRef } from "react";
import { IngredientRef } from "../../data/models";

type Props = {
  initialContent: string;
  readonly: boolean;
  onChange: (content: string, ingredientRefs: IngredientRef[]) => void;
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

export const RecipeEditor = ({ initialContent, onChange, readonly }: Props) => {
  const [_, setMentionsState] = useAtom(mentionsAtom);
  const setLocalIngredients = useSetAtom(localIngredientsAtom);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor(
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
          levels: [1, 2, 3],
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
      content: initialContent,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        if (html === initialContent) return;
        // Parse all mentions from the editor
        const ingredientRefs: IngredientRef[] = [];

        editor.state.doc.descendants((node) => {
          if (node.type.name === "mention") {
            ingredientRefs.push({
              id: node.attrs.id,
              name: node.attrs.name,
              quantity: node.attrs.quantity,
              unit: node.attrs.unit,
            });
          }
        });

        setLocalIngredients(ingredientRefs);
        onChange(html, ingredientRefs);
      },
    },
    []
  );

  useEffect(() => {
    editor.setEditable(!readonly);
  }, [readonly]);

  useEffect(() => {
    if (editor.getHTML() !== initialContent)
      editor.commands.setContent(initialContent);
  }, [initialContent]);

  return (
    <>
      <IngredientSelectorPopover />
      <div ref={editorRef} className="grow flex flex-col" />
      <div className="fixed bottom-0 left-0 p-2 w-full">asd</div>
    </>
  );
};
