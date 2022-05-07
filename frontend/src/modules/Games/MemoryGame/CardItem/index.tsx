import "./index.scss";

interface Props {
  item: { question: string; correctAnswer: number };
  id: number;
  isFlipped: boolean;
  flipCard: (id: number) => void;
}

const CardItem = ({ id, item, isFlipped, flipCard }: Props) => {
  const { question } = item;

  return (
    <div
      className={`card ${isFlipped ? "flipped" : ""} `}
      onClick={() => flipCard(id)}
    >
      <div className="inner">
        <div className="front">{question}</div>
        <div className="back"></div>
      </div>
    </div>
  );
};

export default CardItem;
