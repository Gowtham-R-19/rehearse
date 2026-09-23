// Interview question bank (predefined for now).
// Each question: { type, topic, text, expect } where expect = [[label, 'keyword|keyword'], ...]
// Later, an AI service can generate questions in this same shape.

export const Q = (topic, text, expect) => ({ type: 'tech', topic, text, expect });

// Technical questions per role key (see roles.js)
export const TECH_QUESTIONS = {
  dev:[
      Q('dsa','What is the difference between an array and a linked list, and when would you choose each?',[['Memory layout','contiguous|memory|pointer|node'],['Indexing','index|random access'],['Insertion','insert'],['Deletion','delete|remove'],['Complexity','o(n)|o(1)|constant|linear']]),
      Q('api','Explain how a REST API works and name the common HTTP methods.',[['GET','get'],['POST','post'],['PUT/PATCH','put|patch'],['DELETE','delete'],['Status codes','status code|200|404|500'],['Stateless/JSON','stateless|json']]),
      Q('db','What is the difference between SQL and NoSQL databases?',[['Tables/relational','table|relational'],['Schema','schema'],['Joins','join'],['Scaling','scal'],['Document/key-value','document|key-value|mongodb'],['Transactions','acid|transaction']]),
      Q('oop','Explain the four pillars of object-oriented programming.',[['Encapsulation','encapsulation'],['Inheritance','inheritance'],['Polymorphism','polymorphism'],['Abstraction','abstraction']]),
      Q('git','What is Git, and how would you resolve a merge conflict?',[['Branch','branch'],['Commit','commit'],['Merge','merge'],['Conflict markers/editing','conflict'],['Push/PR','pull request|rebase|push']]),
      Q('dsa','How would you find duplicates in an array, and what is the time complexity?',[['Hash set/map','hash|set|map'],['Linear time','o(n)|linear'],['Sorting option','sort'],['Space trade-off','space|memory'],['Loop/iterate','loop|iterate|traverse']])
  ],
  qa:[
      Q('testing','What is the difference between smoke, sanity, and regression testing?',[['Smoke','smoke'],['Sanity','sanity'],['Regression','regression'],['Build stability','build|stable'],['New change','new feature|change|fix'],['Core functions','critical|core|main']]),
      Q('testing','Walk me through the bug life cycle.',[['New','new'],['Assigned','assigned'],['Open','open'],['Fixed','fixed'],['Retest','retest'],['Verified/closed','verified|closed'],['Reopen','reopen']]),
      Q('testing','How do you write a good test case?',[['Preconditions','precondition'],['Steps','steps'],['Expected result','expected result|expected'],['Test data','test data'],['Priority','priority|severity'],['Edge cases','edge|boundary|negative']]),
      Q('testing','When would you automate a test, and when would you keep it manual?',[['Repetitive/regression','repetitive|regression'],['Cost/time','roi|time|cost'],['Exploratory/usability','exploratory|usability'],['Tools','selenium|cypress|framework'],['Stable features','stable']]),
      Q('testing','What is the difference between severity and priority?',[['Severity','severity'],['Priority','priority'],['Impact','impact'],['Business urgency','business|urgent|order']])
  ],
  devops:[
      Q('devops','What is CI/CD and why does it matter?',[['Continuous integration','continuous integration'],['Delivery/deployment','continuous delivery|continuous deployment|deploy'],['Pipeline','pipeline'],['Automation','automat'],['Tests','test'],['Tools','jenkins|github actions|gitlab']]),
      Q('devops','What is the difference between a container and a virtual machine?',[['Shared kernel','kernel|host os'],['Isolation','isolat'],['Lightweight','lightweight|fast|small'],['Image','image'],['Hypervisor','hypervisor'],['Docker','docker']]),
      Q('devops','Explain what Kubernetes does.',[['Orchestration','orchestrat'],['Pods','pod'],['Scaling','scal'],['Deployments','deployment'],['Cluster/nodes','cluster|node'],['Self-healing','self-heal|restart|rollout']]),
      Q('linux','How would you troubleshoot a Linux server that is running slowly?',[['CPU','top|htop|cpu'],['Memory','memory|ram|free'],['Disk','disk|df|iostat'],['Logs','log'],['Processes','process'],['Network','network']]),
      Q('devops','What is Infrastructure as Code?',[['Tools','terraform|ansible|cloudformation'],['Version control','version control|git'],['Repeatable','repeatable|consistent|reproducible'],['Declarative/templates','declarative|template|yaml'],['Automation','automat']])
  ],
  data:[
      Q('ml','What is the difference between supervised and unsupervised learning?',[['Labels','label'],['Supervised','supervised'],['Unsupervised','unsupervised'],['Classification/regression','classification|regression'],['Clustering','clustering'],['Examples','k-means|decision tree|example']]),
      Q('ml','How do you handle missing values in a dataset?',[['Drop','drop|remove'],['Impute','mean|median|mode|impute'],['Pandas','pandas|fillna'],['Outliers/distribution','outlier|distribution'],['Context','domain|context|understand']]),
      Q('ml','What is overfitting and how do you prevent it?',[['Training data','training'],['Unseen data','test|unseen|validation'],['Regularization','regularization'],['Cross-validation','cross-validation|cross validation'],['Other fixes','more data|simpler|dropout|early stopping']]),
      Q('db','Explain the difference between INNER JOIN and LEFT JOIN.',[['Inner','inner'],['Left','left'],['Matching rows','match'],['NULLs','null'],['Tables','table'],['Both sides','both']]),
      Q('ml','How would you explain a model’s accuracy to a non-technical manager?',[['Precision/recall','precision|recall|f1'],['Business impact','business|impact'],['Plain language','simple|plain|analogy'],['Baseline','baseline|compare'],['Limits','limit|error|risk']])
  ],
  mobile:[
      Q('mobile','What is the difference between an Activity/Fragment (Android) or a ViewController/View (iOS), and when would you use each?',[['Screen container','activity|viewcontroller|screen'],['Reusable UI piece','fragment|view|reusable'],['Lifecycle','lifecycle'],['Navigation','navigation|nav'],['State','state|savedinstancestate']]),
      Q('mobile','How would you make a network call without freezing the app\u2019s UI?',[['Background thread/async','async|thread|coroutine|background'],['Main/UI thread','main thread|ui thread'],['Loading state','callback|loading|spinner'],['Error handling','error|timeout|retry']]),
      Q('mobile','What is the difference between a local database like SQLite/Room and just saving key-value pairs?',[['Structured data','sqlite|room|database|structured|core data'],['Key-value/simple','shared preferences|userdefaults|key-value'],['Complexity/size','complex|large|simple|small'],['Queries','query']]),
      Q('mobile','How do you handle different screen sizes and orientations?',[['Responsive/constraint layouts','constraint|responsive|flexible|autolayout'],['Testing on devices/emulators','emulator|device|simulator'],['Density/points','dp|density|points'],['Orientation change','orientation|rotate']]),
      Q('mobile','What steps are involved in publishing an app update to the Play Store or App Store?',[['Versioning','version'],['Build/sign','build|sign|release'],['Testing/beta','test|beta'],['Store listing/review','store|review|submit']])
  ],
  security:[
      Q('security','What is the CIA triad?',[['Confidentiality','confidentiality'],['Integrity','integrity'],['Availability','availability'],['Examples','encrypt|hash|backup|redundan']]),
      Q('security','Explain SQL injection and how to prevent it.',[['User input','user input|input'],['Query','query'],['Parameterized queries','parameterized|prepared'],['Validation','sanitiz|validat|escape'],['Database','database'],['Least privilege','least privilege|orm']]),
      Q('security','What is the difference between symmetric and asymmetric encryption?',[['Symmetric','symmetric'],['Asymmetric','asymmetric'],['Keys','key'],['Public','public'],['Private','private'],['Examples','aes|rsa'],['Speed','speed|faster|slower']]),
      Q('net','What happens when you type a URL into a browser?',[['DNS','dns'],['TCP','tcp'],['HTTP','http'],['TLS/HTTPS','tls|https|ssl'],['Server','server'],['Response/render','response|render']]),
      Q('security','What is XSS, and how is it different from CSRF?',[['Script injection','script'],['Browser','browser'],['Session/cookie','session|cookie|token'],['User','user'],['Escaping/CSP','sanitiz|escape|csp|content security'],['Forged request','forged|unwanted|authenticated']])
  ],
  support:[
      Q('net','A user says they cannot connect to the internet. How do you troubleshoot it?',[['Cable/Wi-Fi','cable|wifi|wi-fi'],['IP settings','ip|ipconfig'],['Ping','ping'],['DNS','dns'],['Router/gateway','router|gateway'],['Restart','restart|reboot'],['Escalate','escalat']]),
      Q('net','What is the difference between DNS and DHCP?',[['DNS','dns'],['DHCP','dhcp'],['Names','domain|name'],['IP address','ip address'],['Automatic assignment','assign|automatic'],['Resolve/translate','resolve|translate']]),
      Q('support','How do you prioritise several tickets at once?',[['Priority','priority|severity'],['Impact','impact'],['SLA','sla'],['Urgent/critical','urgent|critical'],['Communication','communicat|update'],['Escalate','escalat']]),
      Q('support','What steps would you take to reset a user’s password in Active Directory?',[['Active Directory','active directory'],['Verify identity','verify|identity'],['Reset','reset'],['Unlock','unlock'],['Policy','policy|complexity'],['Log the ticket','document|ticket|log']]),
      Q('support','How would you explain a technical problem to a non-technical user?',[['Plain language','simple|plain|analogy'],['Avoid jargon','jargon'],['Patience/listening','patient|listen'],['Step by step','step'],['Confirm fixed','confirm|check|verify'],['Follow up','follow up|follow-up']])
  ]
};

// Behavioral + intro questions and the STAR checklist
export const STAR = [['Situation','when|during|project|team|semester|internship|situation'],['Task','goal|task|needed to|challenge|problem|responsib|deadline'],['Action','i built|i designed|i implemented|i created|i wrote|i led|i decided|i used|i developed|i fixed|i analy|i organi|i divided|i asked|i learned'],['Result','result|achiev|improved|reduced|increased|saved|won|outcome|delivered|success|completed|%']];
export const BEHAV = [
  'Tell me about a challenging problem you solved. What was your role and what was the result?',
  'Tell me about a time you worked in a team and disagreed with someone. What happened?',
  'Describe a time you had to learn something new quickly. How did you do it?'
];
export const INTRO = { type:'intro', topic:'comm', text:'Tell me about yourself.', expect:[['Education','student|degree|b.tech|btech|bachelor|college|university|graduat|diploma'],['Skills','skill|python|java|javascript|sql|c++|react|linux|network'],['Projects','project|intern|built|developed'],['Goal','looking|goal|interested|passion|role|opportunity|want to']] };

// Label shown above each question in the chat
export const TYPE_LABEL = { intro: 'Introduction', resume: 'From your resume', tech: 'Technical', behav: 'Behavioral' };
