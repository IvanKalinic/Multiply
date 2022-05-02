import { WrongLettersContainer } from "../../styles";

interface Props {
  wrongLetters: Array<any>;
}

const WrongLetters = ({ wrongLetters }: Props) => {
  const total = wrongLetters?.reduce(
    (prev, curr) => (prev === null ? [curr] : [prev, ", ", curr]),
    null
  );

  return (
    <WrongLettersContainer>
      {wrongLetters.length > 0 && <p>Wrong</p>}
      {total}
    </WrongLettersContainer>
  );
};

export default WrongLetters;
