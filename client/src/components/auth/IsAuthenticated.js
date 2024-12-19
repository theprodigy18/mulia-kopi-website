function IsAuthenticated () 
{
    return !!localStorage.getItem('token');
};

export default IsAuthenticated
