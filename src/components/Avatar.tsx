type Props = {
  photoUrl: string;
};
export const Avatar = ({ photoUrl }: Props) => {
  return (
    <div className="p-1.5 bg-base-100 rounded-md shadow-sm shadow-black">
      <div className="avatar">
        <div className="w-8 rounded">{photoUrl && <img src={photoUrl} />}</div>
      </div>
    </div>
  );
};
