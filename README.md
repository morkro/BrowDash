# BrowDash
> [**Brow**ser**Dash**board] - creative, he? ;)

A simple and customisable "new tab" Chrome extension.
_This extension isn't downloadable before version 1.0.0. Until then, I prepared a preview link to see the current status._


## Goals

Having a full customisable dashboard with a set of different modules, called _cards_, using bleeding edge technologies _(i.e. ES6, Web Components, Web Battery API, ...)_. The user can create new cards, delete them, change the order and theme of each card as well as the entire dashboards theme.


## Available features:

- **TextCard:** the basic one; saves simple text. Options: *bold', _italic_, underline, strikethrough, link, erase style.
- **WeatherCard:** displays the current weather based on your location.
- **Timer:** changing the time to 12h _(including AM/PM)_ or 24h is possible. _Default: 24h._
- **TodoCard:** don't need to explain that.


## Planned features

Open features are listed and tagged in the [**issue tracker**](https://github.com/morkro/BrowDash/issues?q=is%3Aopen+is%3Aissue+label%3Afeature).


## Technologies
- [FrontBook](https://github.com/morkro/FrontBook): Browserify + Babel, ESLint
- native Web Components


## How to use

BrowDash is currently **still in heavy development** and not even alpha. As soon as a first beta is available to download, I'll will let you know. In the meantime you can visit [this preview link][7].


## Contribution

- You have an idea of a new card and whish to use it in your dashboard? No problem! Just write me and I will get back to you as soon as I can.
- You found a bug or better way of doing something? Create a pull request!


## License

This projected is licensed under the terms of the [MIT license][1].


## Credits

- [Grunt][2] - A JavaScript Task Runner
- [Node.js][3] - JavaScript platform. Mainly used for Grunt.
- [Google Material Design][4] - The complete projects layout is based on Google's design principles.
- [Sass][5] - CSS preprocessor language.
- [SVG Loaders][6] by Sam herbert
- [Packery][8] - bin-packing layout library by Metafizzy
- [Draggabilly][9] - "Make that shiz draggable"

[1]: https://github.com/morkro/BrowDash/LICENSE
[2]: http://gruntjs.com
[3]: http://nodejs.org
[4]: http://www.google.com/design
[5]: http://sass-lang.com/
[6]: http://samherbert.net/svg-loaders/
[7]: http://labs.morkro.de/browdash
[8]: http://packery.metafizzy.co/
[9]: https://github.com/desandro/draggabilly
