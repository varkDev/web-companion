import './card.css'

function Card({imageSrc, name, description}) {
    return (
        <div className="card-container">
            <div className="card">
                <img className="card-image" src={imageSrc}></img>
                <div className="card-terminal">
                    <p className="card-name">Username: {name}</p>
                    <p className="card-description">Description: {description}</p>
                </div>
            </div>
        </div>
    );
}

export default Card