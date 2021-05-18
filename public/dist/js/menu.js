var worlds_cont = document.querySelector(".worlds_cont");

function display_my_worlds(worlds) {
    
    for (let i = 0; i < worlds.length; i++) {
        let world = worlds[i];

        let world_ele = document.createElement("div");
        world_ele.classList.add('world');
    
        let name_ele = document.createElement("div");
        name_ele.classList.add("name");
        name_ele.innerHTML = world.name;
        world_ele.appendChild(name_ele)

        let enter_btn_cont_ele = document.createElement("div");
        enter_btn_cont_ele.classList.add("enter_btn_cont");
        let enter_btn_ele = document.createElement("button");
        enter_btn_ele.innerHTML = "ENTER";
        enter_btn_ele.setAttribute("data-world-id", world.id)
        enter_btn_ele.setAttribute("onclick", "open_world(this)")
        enter_btn_cont_ele.appendChild(enter_btn_ele);

        world_ele.appendChild(enter_btn_cont_ele);

        worlds_cont.appendChild(world_ele);
    }
}

display_my_worlds(worlds);

function open_world(self) {
    let world_id = self.getAttribute("data-world-id");

    window.open(`/game/world/${world_id}`, "_self")
}