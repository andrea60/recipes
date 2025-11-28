type Props = {
  photoUrl: string;
};
export const Avatar = ({}: Props) => {
  return (
    <div className="avatar">
      <div className="w-8 rounded">
        <img src="https://img.daisyui.com/images/profile/demo/superperson@192.webp" />
      </div>
    </div>
  );
};
