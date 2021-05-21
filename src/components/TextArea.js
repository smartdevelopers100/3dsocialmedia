import React, {useRef, useEffect} from 'react';
import './TextArea.css';

const TextArea = React.forwardRef(({name, label, value, handleChange, rows}, ref) => {
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
            <div className="text-area__group">
                <textarea ref={ref} rows={rows ? rows : 4} onFocus={handleFocus} onBlur={handleBlur} value={value} onChange={handleChange} className="text-area__text"  id={name} name={name} autoComplete="off" />
                <label htmlFor={name} ref={inputLabelRef} className="text-area__label">{label}</label>
                <div className="text-area__bottom-line"></div>
            </div>
    );
});

export default TextArea;
