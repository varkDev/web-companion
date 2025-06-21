import { useEffect, useState } from 'react';
import Card from '../components/card/card.jsx'
import { fetchMe } from '../api/userApi.js';

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then(user => {
        setUser(user);
        setLoading(false);
      })
      .catch((err) => {
        console.error('fetchMe error:', err);
        setUser(null);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-container">
      <Card
        imageSrc={user ? user.profile_picture : undefined}
        name={user ? user.username : undefined}
        description={user ? user.description : undefined}
      />
    </div>
  );
}

export default Home;