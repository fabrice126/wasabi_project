'use strict';

let sanitize = require('../'),
  assert = require('assert');

describe('Sanitize Query', () => {
  it('escapes all special characters', () => {
    let result = sanitize('+ - = && || > < ! ( ) { } [ ] ^ " ~ * ? : \\ / AND OR NOT');
    assert.equal(result, '\\+\\ \\-\\ \\=\\ \\&&\\ \\||\\ \\>\\ \\<\\ \\!\\ \\(\\ \\)\\ \\{\\ \\}\\ \\[\\ \\]\\ \\^\\ \\"\\ \\~\\ \\*\\ \\?\\ \\:\\ \\\\\\ \\/\\ \\A\\N\\D\\ \\O\\R\\ \\N\\O\\T');
  });

  it('escapes all characters in context', () => {
    let result = sanitize('AND there! are? (lots of) char*cters 2 ^escape!');
    assert.equal(result, '\\A\\N\\D\\ there\\!\\ are\\?\\ \\(lots\\ of\\)\\ char\\*cters\\ 2\\ \\^escape\\!');
  });

  it('escapes repeated special characters', () => {
    let result = sanitize('&& || && || > < ! > < ! AND OR NOT NOT OR AND');
    assert.equal(result, '\\&&\\ \\||\\ \\&&\\ \\||\\ \\>\\ \\<\\ \\!\\ \\>\\ \\<\\ \\!\\ \\A\\N\\D\\ \\O\\R\\ \\N\\O\\T\\ \\N\\O\\T\\ \\O\\R\\ \\A\\N\\D');
  });
});
