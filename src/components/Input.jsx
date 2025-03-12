const Input = ({ register, errors, id, type, labelText, rules, placeholder }) => {
    return (
    <div className="mb-3">
        <label htmlFor={id} className="form-label">{labelText}</label>
        <input type={type} className={`form-control ${errors[id] && 'is-invalid'}`} id={id} {...register(id, rules)} placeholder={placeholder} />
        {
            errors[id] && (<div className="invalid-feedback">{errors?.[id]?.message}</div>)
        }
    </div>)
};

export default Input;