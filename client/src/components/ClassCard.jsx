import { formatTime } from "../formatTime.js";

function BookButton({ classId, email, bookClass }) {
  return (
    <button disabled={email === ""} onClick={() => bookClass(classId)}>
      Book
    </button>
  );
}

export default function ClassCard({ cls, email, bookClass }) {
  const spots = cls.capacity - cls.booked;
  let label = spots + " spots left";
  if (spots <= 0) {
    label = "FULL";
  } else if (spots <= 3) {
    label = "Almost full! " + spots + " left";
  }
  return (
    <article>
      <h3>{cls.title}</h3>
      <p>
        {cls.coach}, {formatTime(cls.starts_at)}
      </p>
      <p>{label}</p>
      <BookButton classId={cls.id} email={email} bookClass={bookClass} />
    </article>
  );
}
