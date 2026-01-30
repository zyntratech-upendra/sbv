import HomeHero from "../components/HomeHero";
import HomeStats from "../components/HomeStats";

const Home = () => {
  return (
    <>
    <HomeHero/>
    <HomeStats/>
    <div className="container py-5">
      <div className="text-center">
        <h1 className="fw-bold text-primary">
          Welcome to School Management System
        </h1>
        <p className="text-muted mt-3">
          Manage students, teachers, attendance, and fees efficiently.
        </p>
      </div>
    </div>
    </>
  );
};

export default Home;
