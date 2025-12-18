function exibirContent(index) {
    let project_content = document.querySelectorAll(".project-content")
    project_content[index].style.visibility = "visible"
}

function esconderContent(index) {
    let project_content = document.querySelectorAll(".project-content")
    project_content[index].style.visibility = "hidden"
}

function exibirContentOverlay(index) {
    let project_content = document.querySelectorAll(".project-content-overlay")
    project_content[index].style.visibility = "visible"
}

function esconderContentOverlay(index) {
    let project_content = document.querySelectorAll(".project-content-overlay")
    project_content[index].style.visibility = "hidden"
}




function viewAllProjects() {
    let overlay = document.getElementById("overlayPortfolio").style.display = "flex";
    if (overlay) {
        document.querySelector("body").style.overflowY = "hidden"

    }
}

document.getElementById("fecharOverlay").addEventListener("click", function () {
    document.getElementById("overlayPortfolio").style.display = "none";

    document.querySelector("body").style.overflowY = "scroll"
});