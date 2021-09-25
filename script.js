let sections = document.getElementsByClassName('section')

function checkCollapsed() {
    for (let s of sections) {
        if (s.getAttribute('collapsed') == 'true') {
            let sec = s.getBoundingClientRect()
            let title = s.children[0].getBoundingClientRect()
            s.style.height = title.height + 'px'
        }
        else {
            s.style.height = 'fit-content'
        }
    }
}

checkCollapsed()

for (let f of sections) {
    f.children[0].addEventListener('click', () => {
        if (f.getAttribute('collapsed') == 'true') {
            f.setAttribute('collapsed', 'false')
        }
        else {
            f.setAttribute('collapsed', 'true')
        }
        checkCollapsed()
    })
}