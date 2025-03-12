const Textarea = ({ register, errors, id, labelText, rules, placeholder }) => {
    return (
    <div className="mb-3">
        <label htmlFor={id} className="form-label">{labelText}</label>
        <textarea className={`form-control ${errors[id] && 'is-invalid'}`} id={id} {...register(id, rules)} placeholder={placeholder} />
        {
            errors[id] && (<div className="invalid-feedback">{errors?.[id]?.message}</div>)
        }
    </div>)
};

export default Textarea;