import { Chain } from '@ephox/agar';
import { NamedChain } from '@ephox/agar';
import GuiFactory from 'ephox/alloy/api/component/GuiFactory';
import Button from 'ephox/alloy/api/ui/Button';
import Container from 'ephox/alloy/api/ui/Container';
import ChainUtils from 'ephox/alloy/test/ChainUtils';
import GuiSetup from 'ephox/alloy/test/GuiSetup';
import PositionTestUtils from 'ephox/alloy/test/PositionTestUtils';
import Sinks from 'ephox/alloy/test/Sinks';
import { UnitTest } from '@ephox/bedrock';

UnitTest.asynctest('HotspotPositionTest', function() {
  var success = arguments[arguments.length - 2];
  var failure = arguments[arguments.length - 1];

  GuiSetup.setup(function (store, doc, body) {
    var hotspot = GuiFactory.build(
      Button.sketch({
        action: function () { },
        dom: {
          styles: {
            position: 'absolute',
            left: '100px',
            top: '120px'
          },
          innerHtml: 'Hotspot',
          tag: 'button'
        },
        uid: 'hotspot'
      })
    );

    return GuiFactory.build(
      Container.sketch({
        components: [
          GuiFactory.premade(Sinks.fixedSink()),
          GuiFactory.premade(Sinks.relativeSink()),
          GuiFactory.premade(Sinks.popup()),
          GuiFactory.premade(hotspot)
        ]
      })
    );

  }, function (doc, body, gui, component, store) {
    var cSetupAnchor = Chain.mapper(function (hotspot) {
      return {
        anchor: 'hotspot',
        hotspot: hotspot
      };
    });

    return [
      Chain.asStep({}, [
        NamedChain.asChain([
          ChainUtils.cFindUids(gui, {
            'fixed': 'fixed-sink',
            'relative': 'relative-sink',
            'popup': 'popup',
            'hotspot': 'hotspot'
          }),

          NamedChain.direct('hotspot', cSetupAnchor, 'anchor'),

          PositionTestUtils.cTestSink('Relative, not scrolled', 'relative'),
          PositionTestUtils.cTestSink('Fixed, not scrolled', 'fixed'),

          PositionTestUtils.cScrollDown('hotspot', '1000px'),
          PositionTestUtils.cTestSink('Relative, scrolled 1000px', 'relative'),
          PositionTestUtils.cTestSink('Fixed, scrolled 1000px', 'fixed')
        ])
      ])
    ];
  }, function () { success(); }, failure);
});

