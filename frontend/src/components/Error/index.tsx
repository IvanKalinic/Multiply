import { Link } from "react-router-dom";
import { Wrapper } from "../components.style";

const Error = () => {
  return (
    <Wrapper>
      <div>
        <h1>404</h1>
        <h3>Sorry,the page you tried cannot be found</h3>
        <Link to="/" className="btn">
          Back home
        </Link>
      </div>
    </Wrapper>
  );
};

export default Error;
