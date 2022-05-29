export const show = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
  setter(true);
  setTimeout(() => setter(false), 2000);
};

export const checkWin = (
  correct: Array<string>,
  wrong: Array<string>,
  word: string
) => {
  let status = "win";
  // Check for win
  word.split("").forEach((letter: string) => {
    if (!correct.includes(letter)) {
      status = "";
    }
  });
  // Check for lose
  if (wrong.length === 6) status = "lose";

  return status;
};

export const words = [
  "jednoznamenkasti",
  "dvoznamenkasti",
  "troznamenkasti",
  "geometrija",
  "množenje",
  "zbrajanje",
  "dijeljenje",
  "oduzimanje",
  "umnožak",
  "količnik",
  "zbroj",
  "razlika",
  "djeljenik",
  "djelitelj",
  "operacija",
];

//ž,š,đ,č,ć
export const palatalsCode = [219, 220, 221, 222, 186];
