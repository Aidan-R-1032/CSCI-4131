export async function decodeToken(token){
    const response = await fetch(`/api/username?encoded=${encodeURIComponent(token)}`, {
        method: "GET"
    });
    if (response.ok) {
        const user_info = await response.json(); // Define user_info here
        return user_info;
    }
    else {
        return {error: "Could not decode token"};
    }
}
