const colours = require('./colours.json')

module.exports.theme = {
    color: {
        link: colours.secondary['croud-colour-blue'],
        linkHover: colours.secondary['croud-colour-blue-dark'],
        name: colours.secondary['croud-colour-green-dark'],
        type: colours.secondary['croud-colour-purple-dark'],
        sidebarBackground: colours.primary['croud-colour-black'],
    },
    mq: {
        small: '@media (max-width: 720px)',
    },
    sidebarWidth: '15rem',
    fontFamily: {
        base: '"monospace", "Comic Sans MS", "Comic Sans", cursive'
    }
}

module.exports.styles = {
    StyleGuide: {
        logo: {
            border: 'none',
            padding: 0,
        },
        sidebar: {
            border: 'none',
        },
    },
    TableOfContents: {
        search: {
            width: '100%',
            padding: 0,
            marginBottom: '1.5em',
        },
        input: {
            backgroundColor: '#212121',
            border: 'none',
            borderRadius: 0,
            padding: '1em .5em',
            opacity: 0.5,
            color: colours.primary['croud-colour-white'],
            '&:focus': {
                opacity: 0.8,
            },
        },
    },
    ComponentsList: {
        list: {
            fontSize: '.8em',
        },
        item: {
            '& a': {
                color: '#bbb!important',
                '&:hover': {
                    fontSize: 'inherit',
                    color: `${colours.primary['croud-colour-white']}!important`,
                },
            },
        },
        heading: {
            color: '#fff!important',
            textTransform: 'uppercase !important',
        },
    },
}
