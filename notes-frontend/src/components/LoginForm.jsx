const LoginForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
}
) => {

    console.log('loginform')
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label> username
                    <input
                        type='text'
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    password <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </label>
            </div>
            <button type='submit'>login</button>
        </form>

    )
}

export default LoginForm;