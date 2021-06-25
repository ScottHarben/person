import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="container mt-5 jumbotron">
      <h1 className="display-4">Hello, world!</h1>
      <p className="lead">
        This is a simple hero unit, a simple jumbotron-style component for
        calling extra attention to featured content or information.
      </p>
      <hr className="my-4" />
      <p>
        It uses utility classes for typography and spacing to space content out
        within the larger container.
      </p>
      <Link className="btn btn-lg btn-link btn-primary text-white" to="/signup">
        Sign up
      </Link>
    </div>
  );
}
