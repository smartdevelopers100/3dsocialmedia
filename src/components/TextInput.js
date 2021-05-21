import React, {useRef, useEffect} from 'react';
import './TextInput.css';


const TextInput = React.forwardRef(({name, label, value, handleChange}, ref) => {
    const inputLabelRef = useRef();

    useEffect(() => {
        if(value)
        {
            inputLabelRef.current.classList.add('up');
        }
        
    }, [value]);

    const handleFocus = e => {
        inputLabelRef.current.classList.add('up');
    }

    const handleBlur = e => {
        if(!e.target.value)
        {
            inputLabelRef.current.classList.remove('up');
        }
    }

    return (
            <div className="text-input__group">
                <input type="text" ref={ref} onFocus={handleFocus} onBlur={handleBlur} value={value} onChange={handleChange} className="text-input__text"  id={name} name={name} autoComplete="off" />
                <label htmlFor={name} ref={inputLabelRef} className="text-input__label">{label}</label>
                <div className="text-input__bottom-line"></div>
            </div>
    );
});

export default TextInput;
