import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../lib/firebase";

const Recommends = () => {

  // Fetch content recommended for the user
  const [recommends, setRecommends] = useState([]);

  useEffect(() => {
      const unsubscribe = onSnapshot(query(collection(db, "movies")), (snapshot) => {
        const moviesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
        const shuffledMovies = moviesData.sort(() => Math.random() - 0.5);
        const randomMovies = shuffledMovies.slice(0, 4);
        setRecommends(randomMovies);
      });

      return unsubscribe;
  }, []);

  return (
    <Container>
      <h4>Recommeded For You</h4>
      <Content>
        {
          recommends && recommends.map((movie, key) => (
            <Wrap key={key}>
              <Link to={movie.type === 'series' ? '/series/' + movie.id : '/movies/detail/' + movie.id}>
                <img src={movie.cardImg} alt={movie.title} />
                <PlayButton>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 22v-20l18 10-18 10z" />
                  </svg>
                </PlayButton>
              </Link>
            </Wrap>
          ))
        }
      </Content>
    </Container>
  );
};

const Container = styled.div`
  padding: 0 0 26px;
`;

const Content = styled.div`
  display: grid;
  grid-gap: 25px;
  gap: 25px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Wrap = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;

  &:hover {
    transform: scale(0.98);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-out;
  }

  &:hover img {
    transform: scale(1);
  }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease-out;

  svg {
    width: 30px;
    height: 30px;
    fill: #fff;
  }

  ${Wrap}:hover & {
    opacity: 1;
  }
`;

export default Recommends;