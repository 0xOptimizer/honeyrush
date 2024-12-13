![Honeyrush Logo](https://github.com/0xOptimizer/honeyrush/blob/master/assets/images/honeyrush_logo_256.png?raw=true)
# Honeyrush

Combine tiles to make the bees happy!

---

## Front-end Design Principles

### General
* Built with HTML5, CSS3, and JavaScript;
* Aimed to have a cute eye-candy artstyle alongside a simple yet elegant animation principle;
* Made to be intuitive for all audiences with a focus on the mobile gaming audience;

### Theming & Specifics
* Bees were anthropomorphized to invoke connectivity/feelings to the players via expressive emotions and movements;
* Smooth corners and hexagon patterns were used to imitate bees and their environment;
* Bold letterings were used to highlight important elements, a cursive font for secondary elements, and a tertiary simple font for the tutorials;
* Cute non-interactable elements were added to support the cute aesthetic.

---

## Back-end Tech Stack

### General
* Built with PHP using the Laravel 9 framework library;
* Built separately as a standalone API where the Front-end only calls it for requests;
* API contains a controller for handling requests alongside database insertion or fetching;
* Laravel routing engine were used to provide usable links to score submissions (POST) and score retrievals (GET)

### Database
* Built using MySQL;
* Contains a single table hosting 5 columns for ID, Name, Points, Date of creation and update