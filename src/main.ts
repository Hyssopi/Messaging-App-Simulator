import { unitTest } from './story/debug/unit-tests';
import { template } from './story/template/template';
import { tutorial } from './story/tutorial/tutorial';
import { initialize } from './ui/ui';

initialize();

// Stories
template();
unitTest();
tutorial();
