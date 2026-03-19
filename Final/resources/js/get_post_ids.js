export function getPostIDs(post_element){
    const ids  = post_element.querySelector(".identities");
    const uid_elem = ids.querySelector(".uid");
    const pid_elem = ids.querySelector(".pid");
    const uid = parseInt(uid_elem.innerText);
    const pid = parseInt(pid_elem.innerText);
    return {uid: uid, pid: pid};
}