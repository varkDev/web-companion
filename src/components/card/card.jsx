import './card.css'
import defaultPicture from '../../assets/profile/default.jpg';
import { useEffect, useState, useMemo, useRef } from 'react';
import { fetchMe } from '../../api/userApi';
import logo from '../../assets/logo/web_companion_tr.png';

function Card({imageSrc, name, description}) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const [showIsCopied, setShowIsCopied] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    fetchMe()
      .then(data => {setUser(data);})
      .catch(() => setError('Could not fetch user info'));
  }, []);

  useEffect(() => {
  if (showIsCopied && toastRef.current) {
    const toastInstance = new bootstrap.Toast(toastRef.current);
    toastInstance.show();
    
    const timer = setTimeout(() => setShowIsCopied(false), 3000);
    return () => clearTimeout(timer);
    }
  }, [showIsCopied]);


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
                    className="inner-button-primary mb-2 col-12"
                    onClick={() => setShowPopover(!showPopover)}>
                    {hostname}
                    </button>

                    {showPopover && (
                    <div className="overlay" onClick={() => setShowPopover(false)}>
                        <div className="popover-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="popover-title">
                            <i className="fas fa-triangle-exclamation mr-2"></i>
                                WARNING
                            <button onClick={() => { navigator.clipboard.writeText(domainURL); setShowIsCopied(true)}} className="popover-copy-button">
                                <i className="fas fa-copy"></i>
                            </button>
                        </h3>
                        <p className="popover-message">We DO NOT monitor the domains attached to the profiles of users!</p>
                        <p className="popover-url">{domainURL}</p>
                        <button
                            className="popover-inner-button small mt-2"
                            onClick={() => window.open(domainURL, '_blank')}>
                            Visit Site
                        </button>
                        </div>
                    </div>
                    )}

                    {showIsCopied && (
                    <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div 
                        ref={toastRef}
                        id="liveToast" 
                        className="toast" 
                        role="alert" 
                        aria-live="assertive" 
                        aria-atomic="true">
                        <div className="toast-header">
                            <img 
                                src={logo}
                                className="rounded me-2" 
                                alt="..."/>
                            <strong className="me-auto">Web Companion</strong>
                            <small>Right now</small>
                            <button 
                                type="button" 
                                className="btn-close" 
                                data-bs-dismiss="toast" 
                                aria-label="Close">
                            </button>
                        </div>
                        <div 
                        className="toast-body">
                        URL has been copied to clipboard!
                        </div>
                    </div>
                    </div>
                    )}
                    
                    <div className="d-flex justify-content-between gap-2">   
                        <button 
                        className="inner-button-secondary flex-fill"
                        onClick={() => window.open(twitterURL, '_blank')}>
                        <i className="fab fa-twitter me-2"></i>Twitter
                        </button>

                        <button 
                        className="inner-button-secondary flex-fill"
                        onClick={() => window.open(githubURL, '_blank')}>
                        <i className="fab fa-github me-2"></i>GitHub
                        </button>

                        <button 
                        className="inner-button-secondary flex-fill"
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