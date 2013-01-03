# Bearhug

Bearhug adds a CSS class to an element when it's bigger than its immediate parent.

It's useful for working with fixed-width elements in a fluid-grid context.

### Usage

    Bear.hug({
      small: ".navbar",                     // Smaller element
      big: ".navbar-search-block",          // Child element
      small_class: "collapse-navbar",       // Designate the class name you'd like to add to the smaller element
      big_class: "children-collapsed",      // Designate the class name you'd like to add to the bigger element
      offset:35                             // How close is too close?
    });

