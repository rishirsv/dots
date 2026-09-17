import { LocalStore } from '../../storage/src/local.js';
import { Registry } from './registry.js';
import { OperationBroker } from './broker.js';
import { FrontDoor } from './front-door.js';
import { SkillCatalogue } from '../../skills/src/catalogue.js';
import { addFiles } from '../../capabilities/src/files/index.js';
import { addSearch } from '../../capabilities/src/search/index.js';
import { addTasks } from '../../capabilities/src/tasks/index.js';
import { addArtifacts } from '../../capabilities/src/artifacts/index.js';
import { addDocuments } from '../../capabilities/src/documents/index.js';
import { addImages } from '../../capabilities/src/images/index.js';
import { addNetwork } from '../../capabilities/src/network/index.js';
import { addProcesses } from '../../capabilities/src/processes/index.js';
import { addTerminal } from '../../capabilities/src/terminal/index.js';
import { addCodeMode } from '../../code-mode/src/index.js';
import { addInstructions } from '../../skills/src/instructions.js';
export function createApplication(stateDir: string) { const store = new LocalStore(stateDir), registry = new Registry(); addFiles(registry); addSearch(registry); addTasks(registry); addArtifacts(registry); addDocuments(registry); addImages(registry); addNetwork(registry); addProcesses(registry); addTerminal(registry, stateDir); addCodeMode(registry); addInstructions(registry); const broker = new OperationBroker(store, registry), skills = new SkillCatalogue(store, registry), frontDoor = new FrontDoor(broker, skills); return { store, registry, broker, skills, frontDoor }; }
