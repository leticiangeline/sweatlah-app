import { formatTime } from "../formatTime.js";

function BookButton({ classId, email, isBooked, isFull, bookClass }) {
  if (isBooked) {
    return <button disabled={true}>Booked</button>;
  }
  if (isFull) {
    return <button disabled={true}>Full</button>;
  }
  return (
    <button disabled={email === ""} onClick={() => bookClass(classId)}>
      Book
    </button>
  );
}

export default function ClassCard({ cls, email, isBooked = false, bookClass }) {
  const spots = cls.capacity - cls.booked;
  const isFull = spots <= 0;
  let label = spots + " spots left";
  if (isFull) {
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
      <BookButton
        classId={cls.id}
        email={email}
        isBooked={isBooked}
        isFull={isFull}
        bookClass={bookClass}
      />
    </article>
  );
}
