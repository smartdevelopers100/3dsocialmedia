import React, {useEffect} from 'react';
import './Menu.css';

const MenuItem = ({item}) => {
    return (
        <div className="menu-item" onClick={item.onClick}>
            {item.Icon && <item.Icon className="menu-item__icon" />}
            <div className="menu-item__title">{item.title}</div>
        </div>
    );
}

function Menu({items, setShowMenu}) {

    useEffect(() => {
        const handleClick = e => {
            setShowMenu(false);
        }
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        }

    }, []);

    return (
            <div className="menu-container">
                <div className="menu">
                    {items.map((item, index) => (
                        <MenuItem key={index} item={item} />
                    ))}
                </div>
            </div>
        );
}

export default Menu;
