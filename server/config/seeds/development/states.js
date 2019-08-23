import mongoose from 'mongoose';
import { adminUserId } from './users';
import { phccpShinyToolExample } from './tools';
import {
    testProjectId,
    anotherProjectId
} from './projects.js';

let states = [{
    _id: new mongoose.Types.ObjectId('5cb8de033f40db38a280a99e'),
    resourceType: 'State',
    title: 'PCA on TCGA breast cancer dataset',
    description: `{\"ops\":[{\"insert\":\"Plot of breast cancer classes based on the first 2 principal components of the cancer features.\\n\\n\"}]}`,
    data: `${phccpShinyToolExample.website}?_inputs_&bw_adjust=1&density=true&genename=%22ENSG00000000003%22&genename-selectized=%22%22&individual_obs=false&inputfile=%22%22&n_breaks=%2220%22&n_breaks-selectized=%22%22&rowstats_cell_clicked=%7B%7D&rowstats_rows_all=%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%5D&rowstats_rows_current=%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%5D&rowstats_rows_selected=null&rowstats_search=%22%22&rowstats_state=null&shinyjs-resettable-ok=%7B%7D&sidebarCollapsed=false&sidebarItemExpanded=null&sidebarmenu=%22dset_extra%22&state_description=%22plop%22&state_name=%22plop%22&state_project=%22Test%20Project%22&state_project-selectized=%22%22`,
    projectId: testProjectId,
    tool: phccpShinyToolExample._id,
    createdBy: adminUserId
}, {
    _id: new mongoose.Types.ObjectId('5cb8de033f40db38a280a99f'),
    resrouceType: 'State',
    title: `Diff express cancer indication breast/NSCLC w/ smoking history
        Description`,
    description: `{\"ops\":[{\"insert\":\"Differential expression & GSEA\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"insert\":\"\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"2 filters:\"},{\"insert\":\"\\n- Atezo tx\\n- cancer indication (breast & NSCLC)\\n\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"test covariate\"},{\"insert\":\": cancer indication\\n\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"numerator\"},{\"insert\":\": breast\\n\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"denominator\"},{\"insert\":\": NSCLC\\n\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Batch covariate\"},{\"insert\":\": Smoking history\\n\"}]}`,
    data: `${phccpShinyToolExample.website}?_inputs_&bw_adjust=1&csvtable_cell_clicked=%7B%7D&csvtable_rows_all=%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C36%2C37%2C38%2C39%2C40%2C41%2C42%2C43%2C44%2C45%2C46%2C47%2C48%2C49%2C50%2C51%2C52%2C53%2C54%2C55%2C56%2C57%2C58%2C59%2C60%2C61%2C62%2C63%2C64%2C65%2C66%2C67%2C68%2C69%2C70%2C71%2C72%2C73%2C74%2C75%2C76%2C77%2C78%2C79%2C80%2C81%2C82%2C83%2C84%2C85%2C86%2C87%2C88%2C89%2C90%2C91%2C92%2C93%2C94%2C95%2C96%2C97%2C98%2C99%2C100%2C101%2C102%2C103%2C104%2C105%2C106%2C107%2C108%2C109%2C110%2C111%2C112%2C113%2C114%2C115%2C116%2C117%2C118%2C119%2C120%2C121%2C122%2C123%2C124%2C125%2C126%2C127%2C128%2C129%2C130%2C131%2C132%2C133%2C134%2C135%2C136%2C137%2C138%2C139%2C140%2C141%2C142%2C143%2C144%2C145%2C146%2C147%2C148%2C149%2C150%2C151%2C152%2C153%2C154%2C155%2C156%2C157%2C158%2C159%2C160%2C161%2C162%2C163%2C164%2C165%2C166%2C167%2C168%2C169%2C170%2C171%2C172%2C173%2C174%2C175%2C176%2C177%2C178%2C179%2C180%2C181%2C182%2C183%2C184%2C185%2C186%2C187%2C188%2C189%2C190%2C191%2C192%2C193%2C194%2C195%2C196%2C197%2C198%2C199%2C200%2C201%2C202%2C203%2C204%2C205%2C206%2C207%2C208%2C209%2C210%2C211%2C212%2C213%2C214%2C215%2C216%2C217%2C218%2C219%2C220%2C221%2C222%2C223%2C224%2C225%2C226%2C227%2C228%2C229%2C230%2C231%2C232%2C233%2C234%2C235%2C236%2C237%2C238%2C239%2C240%2C241%2C242%2C243%2C244%2C245%2C246%2C247%2C248%2C249%2C250%2C251%2C252%2C253%2C254%2C255%2C256%2C257%2C258%2C259%2C260%2C261%2C262%2C263%2C264%2C265%2C266%2C267%2C268%2C269%2C270%2C271%2C272%2C273%2C274%2C275%2C276%2C277%2C278%2C279%2C280%2C281%2C282%2C283%2C284%2C285%2C286%2C287%2C288%2C289%2C290%2C291%2C292%2C293%2C294%2C295%2C296%2C297%2C298%2C299%2C300%2C301%2C302%2C303%2C304%2C305%2C306%2C307%2C308%2C309%2C310%2C311%2C312%2C313%2C314%2C315%2C316%2C317%2C318%2C319%2C320%2C321%2C322%2C323%2C324%2C325%2C326%2C327%2C328%2C329%2C330%2C331%2C332%2C333%2C334%2C335%2C336%2C337%2C338%2C339%2C340%2C341%2C342%2C343%2C344%2C345%2C346%2C347%2C348%2C349%2C350%2C351%2C352%2C353%2C354%2C355%2C356%2C357%2C358%2C359%2C360%2C361%2C362%2C363%2C364%2C365%2C366%2C367%2C368%2C369%2C370%2C371%2C372%2C373%2C374%2C375%2C376%2C377%2C378%2C379%2C380%2C381%2C382%2C383%2C384%2C385%2C386%2C387%2C388%2C389%2C390%2C391%2C392%2C393%2C394%2C395%2C396%2C397%2C398%2C399%2C400%2C401%2C402%2C403%2C404%2C405%2C406%2C407%2C408%2C409%2C410%2C411%2C412%2C413%2C414%2C415%2C416%2C417%2C418%2C419%2C420%2C421%2C422%2C423%2C424%2C425%2C426%2C427%2C428%2C429%2C430%2C431%2C432%2C433%2C434%2C435%2C436%2C437%2C438%2C439%2C440%2C441%2C442%2C443%2C444%2C445%2C446%2C447%2C448%2C449%2C450%2C451%2C452%2C453%2C454%2C455%2C456%2C457%2C458%2C459%2C460%2C461%2C462%2C463%2C464%2C465%2C466%2C467%2C468%2C469%2C470%2C471%2C472%2C473%2C474%2C475%2C476%2C477%2C478%2C479%2C480%2C481%2C482%2C483%2C484%2C485%2C486%2C487%2C488%2C489%2C490%2C491%2C492%2C493%2C494%2C495%2C496%2C497%2C498%2C499%2C500%2C501%2C502%2C503%2C504%2C505%2C506%2C507%2C508%2C509%2C510%2C511%2C512%2C513%2C514%2C515%2C516%2C517%2C518%2C519%2C520%2C521%2C522%2C523%2C524%2C525%2C526%2C527%2C528%2C529%2C530%2C531%2C532%2C533%2C534%2C535%2C536%2C537%2C538%2C539%2C540%2C541%2C542%2C543%2C544%2C545%2C546%2C547%2C548%2C549%2C550%2C551%2C552%2C553%2C554%2C555%2C556%2C557%2C558%2C559%2C560%2C561%2C562%2C563%2C564%2C565%2C566%2C567%2C568%2C569%2C570%2C571%2C572%2C573%2C574%2C575%2C576%2C577%2C578%2C579%2C580%2C581%2C582%2C583%2C584%2C585%2C586%2C587%2C588%2C589%2C590%2C591%2C592%2C593%2C594%2C595%2C596%2C597%2C598%2C599%2C600%2C601%2C602%2C603%2C604%2C605%2C606%2C607%2C608%2C609%2C610%2C611%2C612%2C613%2C614%2C615%2C616%2C617%2C618%2C619%2C620%2C621%2C622%2C623%2C624%2C625%2C626%2C627%2C628%2C629%2C630%2C631%2C632%2C633%2C634%2C635%2C636%2C637%2C638%2C639%2C640%2C641%2C642%2C643%2C644%2C645%2C646%2C647%2C648%2C649%2C650%2C651%2C652%2C653%2C654%2C655%2C656%2C657%2C658%2C659%2C660%2C661%2C662%2C663%2C664%2C665%2C666%2C667%2C668%2C669%2C670%2C671%2C672%2C673%2C674%2C675%2C676%2C677%2C678%2C679%2C680%2C681%2C682%2C683%2C684%2C685%2C686%2C687%2C688%2C689%2C690%2C691%2C692%2C693%2C694%2C695%2C696%2C697%2C698%2C699%2C700%2C701%2C702%2C703%2C704%2C705%2C706%2C707%2C708%2C709%2C710%2C711%2C712%2C713%2C714%2C715%2C716%2C717%2C718%2C719%2C720%2C721%2C722%2C723%2C724%2C725%2C726%2C727%2C728%2C729%2C730%2C731%2C732%2C733%2C734%2C735%2C736%2C737%2C738%2C739%2C740%2C741%2C742%2C743%2C744%2C745%2C746%2C747%2C748%2C749%2C750%2C751%2C752%2C753%2C754%2C755%2C756%2C757%2C758%2C759%2C760%2C761%2C762%2C763%2C764%2C765%2C766%2C767%2C768%2C769%2C770%2C771%2C772%2C773%2C774%2C775%2C776%2C777%2C778%2C779%2C780%2C781%2C782%2C783%2C784%2C785%2C786%2C787%2C788%2C789%2C790%2C791%2C792%2C793%2C794%2C795%2C796%2C797%2C798%2C799%2C800%2C801%2C802%2C803%2C804%2C805%2C806%2C807%2C808%2C809%2C810%2C811%2C812%2C813%2C814%2C815%2C816%2C817%2C818%2C819%2C820%2C821%2C822%2C823%2C824%2C825%2C826%2C827%2C828%2C829%2C830%2C831%2C832%2C833%2C834%2C835%2C836%2C837%2C838%2C839%2C840%2C841%2C842%2C843%2C844%2C845%2C846%2C847%2C848%2C849%2C850%2C851%2C852%2C853%2C854%2C855%2C856%2C857%2C858%2C859%2C860%2C861%2C862%2C863%2C864%2C865%2C866%2C867%2C868%2C869%2C870%2C871%2C872%2C873%2C874%2C875%2C876%2C877%2C878%2C879%2C880%2C881%2C882%2C883%2C884%2C885%2C886%2C887%2C888%2C889%2C890%2C891%2C892%2C893%2C894%2C895%2C896%2C897%2C898%2C899%2C900%2C901%2C902%2C903%2C904%2C905%2C906%2C907%2C908%2C909%2C910%2C911%2C912%2C913%2C914%2C915%2C916%2C917%2C918%2C919%2C920%2C921%2C922%2C923%2C924%2C925%2C926%2C927%2C928%2C929%2C930%2C931%2C932%2C933%2C934%2C935%2C936%2C937%2C938%2C939%2C940%2C941%2C942%2C943%2C944%2C945%2C946%2C947%2C948%2C949%2C950%2C951%2C952%2C953%2C954%2C955%2C956%2C957%2C958%2C959%2C960%2C961%2C962%2C963%2C964%2C965%2C966%2C967%2C968%2C969%2C970%2C971%2C972%2C973%2C974%2C975%2C976%2C977%2C978%2C979%2C980%2C981%2C982%2C983%2C984%2C985%2C986%2C987%2C988%2C989%2C990%2C991%2C992%2C993%2C994%2C995%2C996%2C997%2C998%5D&csvtable_rows_current=%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%5D&csvtable_rows_selected=null&csvtable_search=%22%22&csvtable_state=null&density=false&genename=%22ENSG00000000003%22&genename-selectized=%22%22&individual_obs=false&inputfile=%22http%3A%2F%2Fsamplecsvs.s3.amazonaws.com%2FSalesJan2009.csv%22&n_breaks=%2235%22&n_breaks-selectized=%22%22&sidebarCollapsed=false&sidebarItemExpanded=null&sidebarmenu=%22dset_three%22`,
    projectId: testProjectId,
    tool: phccpShinyToolExample._id,
    createdBy: adminUserId
}];

export {
    states
};
