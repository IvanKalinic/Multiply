export const PlayButton = (props: any) => {
  return (
    <button {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        height="50"
        width="50"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export const BackButton = (props: any) => {
  return (
    <button {...props} className={"with-text"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
          clipRule="evenodd"
        />
      </svg>
      Back
    </button>
  );
};

export const PauseButton = (props: any) => {
  return (
    <button {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        height="50"
        width="50"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export const ChatLogo = () => {
  return (
    <button style={{ marginTop: "1rem" }}>
      <svg
        width={50}
        height={50}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        fill="#9fd8ed"
      >
        <path d="M128.001 24.008a104.018 104.018 0 0 0-91.187 154.031l-8.555 29.906a15.995 15.995 0 0 0 19.782 19.782l29.914-8.532A104.008 104.008 0 1 0 128 24.008ZM80.001 140a12 12 0 1 1 12-12 12 12 0 0 1-12 12Zm48 0a12 12 0 1 1 12-12 12 12 0 0 1-12 12Zm48 0a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z" />
      </svg>
    </button>
  );
};

export const VideoCall = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={40}
      viewBox="0 0 512 512"
      fill="#66cc7e"
    >
      <path d="M238 1.1C134.4 8.5 45.4 77.9 13 176.8-.9 219.5-3.2 267.7 6.6 312c15.8 70.7 62.2 132.5 126.3 168 56.7 31.4 125.7 39.8 188.8 23 88.2-23.5 157.8-93.1 181.3-181.3 23.4-87.9-2-182.2-66.4-246.3C391.6 30.6 336 5.5 272.2 1.1c-16.7-1.2-17.3-1.2-34.2 0zm-73 93.5c4.4 2 9.7 6.7 27.7 24.7 25.4 25.4 27.6 28.6 27.6 40.7 0 10.6-3.1 16.1-16.7 29.9-14.5 14.8-15.7 18.2-10.9 33.6 10.8 34.8 64 87.1 97.5 96.1 6.3 1.6 14.6 1.8 18.4.4 1.5-.6 8.2-6.4 14.8-12.9 14-13.7 17.8-15.7 29.1-15.5 11.7.1 14 1.7 39.6 27.3 14.7 14.6 23.5 24.2 24.9 27.1 3.2 6.2 3.8 16.9 1.5 24.1-1.6 4.8-3.9 7.5-21.3 25.1-21 21.3-23.5 23-35.5 24.9-7.7 1.3-20.3-.2-32.4-3.7-55-15.9-134.3-78.9-185.9-147.8-20.3-27-37.7-58.2-45.2-80.9-5.4-16.3-6.5-22.7-6-34.4.6-14.7 1.8-16.6 21.6-36.6 9.2-9.3 18.6-18.2 20.9-19.8 8.9-6.2 19.8-7 30.3-2.3z" />
    </svg>
  );
};
