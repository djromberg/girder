/* globals girderTest, describe, expect, it, runs, waits, waitsFor  */

girderTest.addCoveredScripts([
    '/clients/web/static/built/plugins/candela/plugin.min.js'
]);

girderTest.startApp();

$(function () {
    describe('Test the candela UI.', function () {

        it('register a user', girderTest.createUser(
            'johndoe', 'john.doe@email.com', 'John', 'Doe', 'password!'
        ));

        it('uploads the data file', function () {
            runs(function () {
                expect($('#g-user-action-menu.open').length).toBe(0);
                $('.g-user-text>a:first').click();
            });
            girderTest.waitForLoad();

            runs(function () {
                expect($('#g-user-action-menu.open').length).toBe(1);
                $('a.g-my-folders').click();
            });
            girderTest.waitForLoad();

            runs(function () {
                $('a.g-folder-list-link:last').click();
            });
            girderTest.waitForLoad();

            waitsFor(function () {
                return $('ol.breadcrumb>li.active').text() === 'Public' &&
                       $('.g-empty-parent-message:visible').length === 1;
            }, 'descending into Public folder');

            girderTest.binaryUpload('clients/web/test/testFile.csv');

            runs(function () {
                $('.g-item-list-link:first').click();
            });
        });

        it('sets up candela inputs and renders the visualization', function () {
            waitsFor(function () {
                return $('.g-item-candela-component').length === 1;
            }, 'the candela component selector to appear');

            runs(function () {
                expect($('.g-item-candela-component option').length).toBeGreaterThan(18);
            });

            waitsFor(function () {
                return $('.g-candela-inputs-container').length === 1;
            }, 'the inputs container to exist');

            runs(function () {
                var inputs = $('.g-candela-inputs-container').children().eq(1).children().children();
                expect(inputs.eq(0).find('label').text()).toBe('Width');
                expect(inputs.eq(1).find('label').text()).toBe('Height');
                expect(inputs.eq(2).find('label').text()).toBe('x');
                expect(inputs.eq(2).find('option').eq(0).text()).toBe('(none)');
                expect(inputs.eq(2).find('option').eq(1).text()).toBe('a');
                expect(inputs.eq(2).find('option').eq(2).text()).toBe('b');
                expect(inputs.eq(2).find('option').eq(3).text()).toBe('c');
                expect(inputs.eq(3).find('label').text()).toBe('y');
                expect(inputs.eq(4).find('label').text()).toBe('color');
                expect(inputs.eq(5).find('label').text()).toBe('hover');
                $('.g-candela-update-vis').click();
            });

            waitsFor(function () {
                return $('.g-candela-vis').find('canvas').length === 1;
            }, 'the vis canvas to be drawn');
        });
    });
});
