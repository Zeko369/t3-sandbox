import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { ErrorBoundary } from "react-error-boundary";

const FindPost: React.FC<{ id: number }> = ({ id }) => {
  const { data, error, isLoading } = trpc.example.getPost.useQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{String(error)}</div>;
  }

  return (
    <div>
      <h1>{data.title}</h1>
    </div>
  );
};

const Wrapped: React.FC<{ id: number }> = ({ id }) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ resetErrorBoundary, error }) => (
        <div>
          <h1>{String(error)}</h1>
          <button onClick={resetErrorBoundary}>Reset</button>
        </div>
      )}
    >
      <FindPost id={id} />
    </ErrorBoundary>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Wrapped id={1} />
      <Wrapped id={2} />
    </>
  );
};

export default Home;
