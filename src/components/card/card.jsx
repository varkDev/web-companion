import './card.css'
import defaultPicture from '../../assets/profile/default.jpg';
import { useEffect, useState, useMemo } from 'react';
import { fetchMe } from '../../api/userApi';

function Card({imageSrc, name, description}) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMe()
      .then(data => {setUser(data);})
      .catch(() => setError('Could not fetch user info'));
  }, []);

  const fallbackImage = imageSrc || defaultPicture;
  const fallbackName = name || 'Anonymous';
  const fallbackDescription = description || 'No description available.';

  const resolvedImage = user?.profile_picture || fallbackImage;
  const resolvedName = user?.username || fallbackName;
  const resolvedDescription = user?.description || fallbackDescription;

  const domainURL = user?.website || '';
  const githubURL = user?.social_links?.github || '';
  const twitterURL = user?.social_links?.twitter || '';
  const linkedinURL = user?.social_links?.linkedin || '';

  const hostname = useMemo(() => {
    if (domainURL) {
        try {
            return new URL(domainURL).hostname.toLowerCase();
        }  catch {
            return 'Invalid Domain';
        }
    }   return "Undefined Domain";
  }, [domainURL]);

  return (
    <div className="card-container">
        <div className="card">
            <img className="card-image" src={resolvedImage}></img>
            <div className="card-terminal mb-4">
                <p className="card-name">Username: {resolvedName}</p>
                <p className="card-description">Description: {resolvedDescription}</p>
                <div className="mt-2 card-terminal-buttons">
                    
                    <button 
                    className="inner-button mb-2 col-12"
                    onClick={() => window.open(domainURL, '_blank')}>
                    {hostname}
                    </button>
                    
                    <div className="d-flex justify-content-between gap-2">   
                        <button 
                        className="inner-button flex-fill"
                        onClick={() => window.open(twitterURL, '_blank')}>
                        <i className="fab fa-twitter me-2"></i>Twitter
                        </button>

                        <button 
                        className="inner-button flex-fill"
                        onClick={() => window.open(githubURL, '_blank')}>
                        <i className="fab fa-github me-2"></i>GitHub
                        </button>

                        <button 
                        className="inner-button flex-fill"
                        onClick={() => window.open(linkedinURL, '_blank')}>
                        <i className="fab fa-linkedin me-2"></i>LinkedIn
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
}

export default Card