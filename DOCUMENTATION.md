# PathWise: An AI-Powered Career Guidance and Development Platform

## Final Year Project Documentation

---

**Project Title:** PathWise — Personalised Career Guidance Using Machine Learning and Generative Artificial Intelligence

**Submitted in partial fulfilment of the requirements for the award of Bachelor of Science in Computer Science / Software Engineering**

**Live Platform:** https://pathwise.mr-asanteeprog.workers.dev

**Source Repository:** https://github.com/collinsasante/career-ai

**Academic Year:** 2025–2026

---

## Abstract

Career guidance has long been identified as a critical determinant of graduate outcomes, professional satisfaction, and economic productivity. Despite this, the tools available to most individuals navigating career decisions remain generic, academically biased, and insufficiently personalised. This project presents PathWise, a full-stack, production-deployed web platform that addresses these deficiencies through the integration of machine learning, generative artificial intelligence, and structured career knowledge engineering.

PathWise is designed specifically for the Ghanaian education system and the broader African context, addressing the acute shortage of personalised career guidance for students transitioning through BECE, WASSCE, SHS programme selection, COTVET TVET qualifications, and tertiary degree programmes. The platform supports eight distinct education stages — JHS Student, SHS Student, TVET Student, Polytechnic Student, University Student, Graduate, Working Professional, and Career Switcher — and adapts its recommendations, dashboard panels, and AI advisor to the specific needs, pathways, and terminology of each stage.

The onboarding flow begins with an education-stage selector that captures the user's current position in Ghana's educational hierarchy, followed by stage-specific conditional fields (SHS subject combination, TVET specialisation, university degree programme), certification interest, and entrepreneurship interest. A stage recommendation engine then produces education-aware guidance: JHS students receive SHS programme comparisons, SHS students receive tertiary institution and degree pathway recommendations, TVET students receive COTVET certification tracks and entrepreneurship pathways, and university students and graduates receive career-readiness analysis and advancement strategies.

The ML recommendation engine employs a trained scikit-learn classification model that compares multi-dimensional user feature vectors against ninety-six curated career profiles spanning ten professional sectors. Where the ML service is unavailable, the system falls back automatically to Anthropic's Claude AI. The AI conversational advisor is grounded in Ghana-specific career data — WASSCE requirements, COTVET qualifications, Ghanaian professional bodies (ICAG, GhIE, Ghana Bar Association, GNMC), National Service, and Ghanaian tertiary institutions including UG, KNUST, UCC, Ashesi, and UHAS.

The system is deployed on Cloudflare's global edge network using the OpenNext adapter, achieving sub-200 millisecond page loads on cached content. Firebase Authentication handles identity management, and a novel server-side configuration endpoint resolves the structural incompatibility between Next.js build-time variable baking and Cloudflare Workers' runtime-only secret injection.

Evaluation against a comprehensive test matrix demonstrates that all critical user journeys function correctly under production conditions. The platform represents a meaningful contribution to the application of AI and machine learning in career guidance technology within the African context, with a clear architectural pathway toward integration with real-time Ghanaian labour market datasets in future iterations.

---

## Acknowledgements

The completion of this project would not have been possible without the support, guidance, and encouragement of a number of individuals and institutions.

I would like to express my sincere gratitude to my project supervisor, whose direction and critical feedback throughout the development process helped refine both the technical implementation and the academic framing of this work. Their willingness to engage with the unconventional architectural choices made in this project — particularly the decision to deploy on an edge computing platform rather than a traditional server — was invaluable.

I am grateful to the broader academic community whose published research in career guidance theory, recommender systems, and applied machine learning provided the intellectual foundation upon which PathWise is built. The works of Frank Parsons, John Holland, Donald Super, and more recent scholars in the fields of educational technology and conversational AI have shaped the platform's design in ways that are documented throughout this report.

I would also like to acknowledge the open-source community whose tools — Next.js, React, scikit-learn, Tailwind CSS, and the broader JavaScript and Python ecosystems — made the implementation of a production-grade platform achievable within the time and resource constraints of an undergraduate final year project.

Finally, I thank my family and peers for their patience, encouragement, and willingness to serve as early testers of the platform. Their feedback on the usability of the onboarding flow and the clarity of the AI advisor's responses directly influenced several design revisions documented in Chapter Four of this report.

---

## Table of Contents

- Abstract
- Acknowledgements
- Table of Contents
- List of Figures
- List of Tables
- Chapter One: Introduction
  - 1.1 Background of the Study
  - 1.2 Problem Statement
  - 1.3 Aim and Objectives
  - 1.4 Research Questions
  - 1.5 Scope of the Project
  - 1.6 Significance of the Study
  - 1.7 Limitations
  - 1.8 Organisation of the Study
- Chapter Two: Literature Review
  - 2.1 Overview
  - 2.2 Career Guidance: History and Theoretical Foundations
  - 2.3 Digital Career Guidance Systems
  - 2.4 Machine Learning in Recommendation Systems
  - 2.5 Conversational AI and Large Language Models in Advisory Contexts
  - 2.6 Existing Platforms: A Comparative Analysis
  - 2.7 Identified Gaps and Justification for PathWise
- Chapter Three: System Analysis and Design
  - 3.1 Analysis of Existing Systems
  - 3.2 Proposed System Overview
  - 3.3 Functional Requirements
  - 3.4 Non-Functional Requirements
  - 3.5 System Architecture
  - 3.6 Database Design
  - 3.7 Authentication Flow
  - 3.8 Recommendation Engine Architecture
  - 3.9 AI Chat Workflow
  - 3.10 Roadmap Generation Workflow
  - 3.11 API Structure
  - 3.12 Security Design
- Chapter Four: System Implementation and Testing
  - 4.1 Development Methodology
  - 4.2 Frontend Implementation
  - 4.3 Backend and API Implementation
  - 4.4 Authentication Implementation
  - 4.5 Machine Learning Implementation
  - 4.6 AI Integration
  - 4.7 Roadmap System Implementation
  - 4.8 Database Operations
  - 4.9 Deployment
  - 4.10 Testing
  - 4.11 Challenges and Solutions
- Chapter Five: Summary, Conclusion, and Recommendations
  - 5.1 Project Summary
  - 5.2 Achievements
  - 5.3 System Strengths
  - 5.4 Limitations
  - 5.5 Recommendations and Future Work
  - 5.6 Conclusion
- References
- Appendices

---

## List of Figures

- Figure 3.1: High-Level System Architecture of PathWise
- Figure 3.2: User Registration and Authentication Flow
- Figure 3.3: Six-Step Onboarding Data Collection Flow
- Figure 3.4: Recommendation Engine Architecture (ML-First with Claude Fallback)
- Figure 3.5: AI Chat Agent Pipeline — Intent Detection to Streamed Response
- Figure 3.6: Roadmap Generation and Caching Workflow
- Figure 3.7: Airtable Data Model — Five-Table Schema
- Figure 3.8: Middleware Route Protection Decision Tree
- Figure 4.1: Activity Discovery Cards — Onboarding Step Three
- Figure 4.2: Career Library Sector Navigation
- Figure 4.3: Roadmap Detail Page — Alternative Pathways Section
- Figure 4.4: Cloudflare Workers Deployment Pipeline

---

## List of Tables

- Table 2.1: Comparative Analysis of Existing Career Guidance Platforms
- Table 3.1: Functional Requirements Specification
- Table 3.2: Non-Functional Requirements Specification
- Table 3.3: Airtable Profiles Table Schema
- Table 3.4: Airtable Recommendations Table Schema
- Table 3.5: Airtable Roadmaps Table Schema
- Table 3.6: Airtable RoadmapProgress Table Schema
- Table 3.7: API Endpoints Reference
- Table 3.8: Environment Variables and Secrets Inventory
- Table 4.1: ML User Profile Feature Vector Description
- Table 4.2: Authentication Test Results
- Table 4.3: Onboarding and Profile Test Results
- Table 4.4: Recommendation Engine Test Results
- Table 4.5: Roadmap System Test Results
- Table 4.6: AI Chat Advisor Test Results
- Table 4.7: Observed System Performance Metrics

---

# CHAPTER ONE: INTRODUCTION

## 1.1 Background of the Study

The relationship between an individual's career choice and their long-term wellbeing, economic stability, and sense of fulfilment has been extensively documented in occupational psychology and labour economics literature. Research consistently demonstrates that individuals who enter careers aligned with their interests, skills, and values experience greater job satisfaction, higher productivity, longer tenure, and reduced rates of occupational burnout (Holland, 1959; Super, 1980; Savickas, 2005). Conversely, career misalignment — the condition in which a person's occupation does not match their natural aptitudes, preferences, or goals — is associated with chronic workplace disengagement, increased susceptibility to mental health challenges, and elevated rates of career switching that impose significant economic costs on both individuals and employers (Lent, Brown, & Hackett, 1994).

Despite the well-established importance of sound career decision-making, the support infrastructure available to most people navigating these choices remains remarkably underdeveloped. In many educational institutions, career guidance is delivered through annual sessions with a careers adviser whose caseload may run to hundreds of students, leaving each individual with at best twenty minutes of personalised engagement per academic year. These sessions are typically supplemented by generic leaflets, online course directories, and skills assessment quizzes that — despite their apparent interactivity — apply the same fixed mapping logic to every user, producing recommendations that are often indistinguishable from one student to the next.

The technological landscape of career guidance has evolved considerably since the first computer-assisted guidance systems emerged in the 1960s. The transition from mainframe-based systems such as SIGI and DISCOVER to internet-accessible platforms in the 1990s dramatically expanded the reach of digital career tools. The subsequent emergence of big data, machine learning, and, most recently, large language models, has created the conditions for a qualitative leap in what career guidance systems can offer: not merely broader access to the same generic advice, but genuinely personalised, dynamically adaptive, and contextually aware guidance that draws on the full richness of an individual's profile.

PathWise is a direct response to this opportunity. Developed as a final year undergraduate project in Computer Science, it is a full-stack web application that integrates a trained machine learning model, a grounded generative AI advisor, and a structured career knowledge base to deliver personalised career recommendations, skill gap analysis, and step-by-step learning roadmaps. The platform is not a prototype or a conceptual demonstration — it is a production-deployed system accessible at https://pathwise.mr-asanteeprog.workers.dev, built on an edge computing infrastructure capable of serving users globally with sub-200 millisecond response times on cached routes.

The project draws on theoretical frameworks from vocational psychology, including the trait-and-factor tradition established by Parsons (1909) and developed by Holland (1959), the developmental career theory of Super (1953, 1980), and the constructivist approach of Savickas (2005), while also engaging with technical literature in recommender systems, natural language processing, and responsible AI integration. This combination of theoretical grounding and practical implementation distinguishes PathWise from both purely academic exercises and purely commercial products that lack intellectual justification for their design decisions.

## 1.2 Problem Statement

The career guidance landscape, despite decades of technological development, continues to fail a substantial proportion of users. The failures are not primarily technical — they are architectural and philosophical. Existing systems are built on assumptions about who seeks career guidance, what information they arrive with, and what constitutes a valid career pathway that are, in many cases, simply incorrect.

The first and most pervasive failure is the assumption that users arrive with a clear sense of what career domain they are interested in. Most digital career tools present users with a menu of career sectors and ask them to select one before any guidance is offered. This immediately excludes the largest and arguably most needy group: individuals who genuinely do not know what direction to take. For these users — school leavers entering higher education, graduates confronting their first independent career decisions, and mid-career professionals whose circumstances have changed — the inability to begin the guidance process without already having an answer to the central question being asked is a fundamental design failure.

The second failure is the academic pathway bias that pervades most career guidance systems. The overwhelming majority of digital platforms, and virtually all institutional career services, implicitly treat university education as the default, legitimate, and preferable route to career development. Alternative pathways — self-directed learning, vocational certification, apprenticeship programmes, and the building of freelance practice — are either absent from these platforms or presented as lesser alternatives. In an economy where self-taught developers command six-figure salaries, certified project managers without degrees lead large teams, and freelance designers build sustainable independent businesses, this bias is not only inaccurate but actively harmful to users who might thrive through non-traditional routes.

The third failure is the superficiality of matching logic in most existing systems. Career assessment questionnaires typically collect responses about personality traits, learning styles, or general interests and map them to career categories through fixed rule tables. A user who selects "I like working with people" may be directed toward teaching, nursing, or human resources — regardless of whether they have any skills in those areas, any interest in the industries those careers inhabit, or any alignment with the work styles those roles require. The absence of learning — of a model that generalises from patterns in how different combinations of characteristics relate to career fit — means these systems cannot improve or adapt. They apply the same logic to the ten-thousandth user as to the first.

The fourth failure is the absence of continuity. Career guidance, in most digital implementations, is a transactional event: a user completes an assessment, receives a result, and the interaction ends. There is no mechanism to track the user's learning progress, update recommendations as their skills develop, answer follow-up questions in a way that references their specific profile, or provide contextually grounded advice as they move through the career development process. This transactional model may serve users who arrive with a clear question and a defined answer space, but it is poorly suited to the iterative, exploratory nature of real career development.

PathWise addresses each of these failures directly. It begins with activity-based discovery rather than career selection, explicitly surfaces non-traditional pathways with equal prominence, employs a trained machine learning model rather than fixed rule tables, and provides continuous, contextually aware AI guidance through a conversational advisor that retains knowledge of the user's complete profile throughout every interaction.

## 1.3 Aim and Objectives

The overarching aim of this project is to design, implement, and deploy a personalised career guidance platform that uses machine learning and generative artificial intelligence to address the documented deficiencies in existing career guidance systems, making high-quality, adaptive career advice accessible to individuals regardless of their prior career knowledge, educational background, or institutional affiliation.

This aim is pursued through the following specific objectives:

The first objective is to design and implement a supervised machine learning model that accepts a structured user profile — comprising interests, skills, work preferences, and career goals — and returns a ranked list of compatible careers from a knowledge base of ninety-six professions, with associated compatibility scores and feature-level reasoning. The model must generalise effectively to user profiles not seen during training and must operate within the latency constraints of a production web application.

The second objective is to develop a structured career knowledge base of sufficient breadth and depth to serve users across the full range of professional sectors, including technology, healthcare, law, business, education, engineering, creative arts, science, trades, and environmental fields. Each career entry must contain the information required for both machine learning feature comparison (required skills, compatible industries, work styles, demand level) and user-facing presentation (salary ranges, time to readiness, possible roles, progression levels).

The third objective is to build an onboarding system that collects user profile data through a guided, interest-first interaction that does not require users to have prior knowledge of career labels. The system must collect sufficient information for meaningful recommendation generation while remaining engaging and achievable for users with diverse educational backgrounds and digital literacy levels.

The fourth objective is to integrate Anthropic's Claude AI as a conversational career advisor whose responses are grounded in verified platform data for each user, adapting its communication style and depth to the user's declared experience level. The integration must include appropriate mechanisms for preventing the generation of false or misleading information about career requirements, salaries, or employment prospects.

The fifth objective is to generate personalised learning roadmaps for each recommended career, accounting for the user's existing skill set, preferred learning mode, and time availability. These roadmaps must be accompanied by an alternative pathways framework that presents university, self-taught, certification, and freelance routes with equal visual weight and substantive actionable content.

The sixth objective is to deploy the complete platform on a production-grade infrastructure capable of serving real users globally, with appropriate authentication, data persistence, input validation, rate limiting, and error monitoring.

## 1.4 Research Questions

This project is guided by the following research questions, each of which corresponds to a dimension of the design and evaluation:

How can an interest-first, activity-based onboarding experience be designed to collect the information necessary for meaningful ML-based career recommendation, while remaining accessible to users who do not yet have career vocabulary?

To what extent can a supervised machine learning model trained on curated, structured career-profile feature vectors produce meaningful and differentiable career compatibility rankings across a diverse user population?

How can a large language model be integrated into a career advisory application in a way that grounds its outputs in verified platform data, reduces hallucination risk, and adapts its communication style to the user's declared experience level?

What architectural patterns are required to deploy a Next.js application on Cloudflare Workers' edge runtime in a way that maintains compatibility with external services (Firebase, Airtable, Anthropic API, scikit-learn) while respecting the constraints of the edge environment?

## 1.5 Scope of the Project

PathWise covers ninety-six careers spanning ten professional sectors: Computing and Technology, Data and Artificial Intelligence, Engineering, Health Sciences, Business and Finance, Arts, Design and Media, Legal and Compliance, Education and Social Services, Trades and Vocational, and Environment and Agriculture. This breadth ensures that the platform can serve users with widely varying interests and backgrounds, from aspiring software developers to prospective nurses, from would-be architects to individuals considering careers in sustainable agriculture.

The career knowledge base is manually curated and represents a snapshot of labour market conditions at the time of development. The platform does not currently integrate with live labour market data feeds, government occupational surveys, or commercial hiring datasets. Career descriptions, salary ranges, and skill requirements are verified against publicly available occupational information at the time of writing but are not automatically refreshed.

The machine learning model is trained on synthetic feature vectors derived from the curated career profiles using a knowledge distillation approach. It does not incorporate real-world hiring outcome data, longitudinal career satisfaction surveys, or employer-reported skill demand data. Its outputs represent profile compatibility scores, not employment probability estimates or earnings predictions.

The platform is available in English and is optimised for users in Ghana and the broader West African context. Career descriptions, salary ranges (expressed in Ghana Cedis where applicable), educational pathway data, and institutional references are aligned with Ghana's education system — BECE, WASSCE, SHS programme tracks, COTVET TVET, and Ghana's major universities and polytechnics. The career content is broadly applicable across anglophone Sub-Saharan Africa.

The project does not extend to employer-facing features, job board integration, mentorship marketplace functionality, or mobile application development. These are identified as valuable future extensions but fall outside the scope of the current implementation.

## 1.6 Significance of the Study

This project makes contributions to several intersecting areas of academic and practical importance.

In the domain of educational technology, PathWise demonstrates that a production-grade career guidance platform can be built and deployed as an undergraduate final year project, challenging the assumption that sophisticated AI-integrated systems require teams of professional engineers and enterprise infrastructure. The architectural decisions made in this project — edge deployment, managed database services, API-first AI integration — represent a replicable template for future student and early-stage projects in this space.

In the domain of applied machine learning, the project provides a concrete implementation of the knowledge distillation from rules approach to training a career recommendation model in the absence of real-world outcome data. The feature engineering strategy, synthetic training data generation method, and model evaluation approach are documented in sufficient detail to support replication and extension by future researchers.

In the domain of responsible AI integration, PathWise demonstrates the grounded generation pattern for constraining large language model outputs within a domain-specific application. The technique of assembling verified platform data into a structured context block and injecting it into the model's system prompt, with explicit instructions prohibiting the fabrication of platform-specific statistics, represents a practical and academically documented approach to LLM hallucination mitigation in consumer applications.

In the domain of career guidance practice, the platform represents a structural argument for interest-first, pathway-inclusive career guidance design. By beginning with activity discovery and surfacing non-traditional pathways explicitly, PathWise operationalises theoretical arguments from vocational psychology that have not previously been implemented at this level of technical sophistication in an accessible, free-to-use platform.

## 1.7 Limitations

Several limitations of the current implementation must be acknowledged in the interest of intellectual honesty and to guide future research and development.

The most significant limitation is the static nature of the career knowledge base. The ninety-six careers currently included in PathWise are described using data that reflects the labour market at the time of development. Salary ranges, job demand levels, required skills, and available tools change continuously as industries evolve, technologies emerge, and economic conditions shift. Without a mechanism for automatic data refresh, the platform's recommendations will degrade in accuracy over time relative to the actual state of the labour market.

The second limitation is the synthetic nature of the machine learning model's training data. Because no real-world dataset of user profiles paired with career satisfaction or employment outcomes is publicly available at the required scale and structure, the model is trained on synthetic profiles generated from the curated career data itself. This means the model's learned weights reflect the structure of the domain knowledge, not the complexity of real user diversity. Users with highly unusual interest-skill combinations — whose profiles fall far from any career template in the knowledge base — may receive less accurate recommendations than users whose profiles more closely match the training distribution.

The third limitation is the in-memory implementation of the rate limiting system. Because Cloudflare Workers runs as isolated V8 isolates that do not share memory across instances, the rate limiter implemented in PathWise does not enforce consistent limits under distributed load. A user who sends requests that are routed to different Worker instances may exceed the nominal rate limit without triggering a 429 response. This is a known limitation of the current implementation and is documented as a priority for future resolution.

The fourth limitation is the platform's current English-only availability. Career guidance needs are not confined to anglophone populations, and the absence of multilingual support restricts the platform's reach and reinforces an implicit cultural bias in its framing.

## 1.8 Organisation of the Study

This report is organised into five chapters. Chapter One has introduced the background, problem statement, objectives, research questions, scope, significance, and limitations of the project. Chapter Two presents a review of the relevant literature, covering the theoretical foundations of career guidance, the evolution of digital guidance systems, machine learning in recommendation contexts, conversational AI in advisory applications, and a comparative analysis of existing platforms. Chapter Three presents the system analysis and design, including requirements specification, architectural decisions, data model design, workflow descriptions, and security considerations. Chapter Four documents the implementation and testing process, covering development methodology, specific technical implementation decisions, testing methodology, and an honest account of challenges encountered and solutions applied. Chapter Five concludes the report with a summary of achievements, an assessment of the system's strengths and limitations, and recommendations for future development.

---

# CHAPTER TWO: LITERATURE REVIEW

## 2.1 Overview

This chapter situates PathWise within the broader academic and practical landscape of career guidance technology. It traces the intellectual lineage of career guidance from its early twentieth century foundations through the emergence of digital systems, examines the state of machine learning applied to recommendation in educational and career contexts, reviews the growing body of literature on large language models in advisory applications, and concludes with a comparative analysis of existing career guidance platforms against which PathWise's design choices can be evaluated. The chapter is analytical rather than merely descriptive: where existing systems and approaches are discussed, their limitations are identified alongside their contributions.

## 2.2 Career Guidance: History and Theoretical Foundations

The formal discipline of career guidance was established by Frank Parsons at the turn of the twentieth century. Parsons (1909), writing in the context of industrialising America where young men were migrating from agricultural communities to urban factories with few tools for navigating the expanding occupational landscape, proposed what became known as the trait-and-factor model. The model rests on three propositions: individuals have measurable traits (aptitudes, interests, values, and personal qualities); occupations have measurable requirements (skill demands, working conditions, and reward structures); and sound vocational decisions are produced by achieving a rational match between the two. This framework provided the first systematic basis for career counselling and remains influential today.

Holland (1959, 1973) extended the trait-and-factor tradition by proposing a typological theory of career choice in which both individuals and work environments could be categorised according to six types: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional, arranged in a hexagonal model. The theory predicts that individuals whose personality type matches the dominant environment type of their occupation will experience greater satisfaction, stability, and achievement. Holland's model has been extensively validated across cultural contexts and occupational domains over more than six decades (Nauta, 2010; Rounds & Su, 2014) and forms the theoretical backbone of widely used psychometric instruments including the Strong Interest Inventory and the Self-Directed Search. Commercial platforms including CareerExplorer and the Myers-Briggs career guidance tools are built on Hollandian foundations.

The limitations of the static trait-and-factor approach were identified early and prompted the development of developmental theories of career choice. Super (1953, 1980) proposed that career development is a lifelong process unfolding through predictable stages — growth, exploration, establishment, maintenance, and disengagement — during which individuals progressively elaborate, implement, and ultimately withdraw from a developing self-concept expressed through vocational roles. Super's theory shifted the focus of career guidance from a one-time matching exercise to an ongoing developmental process, a conceptual move with significant implications for platform design: if career development is continuous, guidance systems must support users across time rather than delivering a single result.

Savickas (2005) extended this developmental perspective through Career Construction Theory, which frames career development not as the unfolding of a predetermined self-concept but as the active construction of a career identity through the meaning individuals make of their work-related experiences, aspirations, and relationships. Constructivist approaches emphasise narrative, reflexivity, and the social context of career decision-making. They are more difficult to operationalise in digital systems than Holland's typological model, but they have influenced the design of qualitative career tools that emphasise open-ended self-reflection alongside structured assessment.

PathWise draws selectively on these theoretical traditions. Its machine learning recommendation engine reflects the trait-and-factor heritage, comparing structured user profile features against structured career requirement features to produce compatibility scores. Its conversational AI advisor reflects the developmental and constructivist traditions, engaging users in exploratory dialogue, adapting its responses to the user's evolving self-understanding, and resisting the reduction of career guidance to a single definitive answer.

## 2.3 Digital Career Guidance Systems

The transition from paper-based career assessment instruments to computerised systems began in the 1960s with the development of SIGI (System of Interactive Guidance and Information) at Educational Testing Service (Katz, 1975). SIGI represented a significant conceptual advance over passive career booklets by allowing users to interact with an occupational database, explore the implications of different value priorities for career satisfaction, and receive tailored information based on their expressed preferences. Subsequent systems — DISCOVER, Choices, and their successors — expanded the interactive functionality and occupational coverage of digital career guidance through the 1970s, 1980s, and 1990s.

The advent of the World Wide Web in the mid-1990s transformed the distribution landscape for career guidance tools, making previously institutional-only systems available to general users through a web browser. O*NET (the Occupational Information Network), maintained by the United States Department of Labor, represents the most comprehensive publicly available occupational taxonomy, classifying over nine hundred occupations according to hundreds of standardised descriptors including knowledge areas, skills, abilities, work activities, interests, and work values. O*NET's data underpins many commercial and educational career guidance platforms and represents a significant publicly funded investment in occupational information infrastructure. The UK's equivalent, the National Careers Service, provides a web-accessible career explorer that draws on national occupational data.

Despite these advances, the fundamental architecture of most digital career guidance systems has not changed substantially since the 1970s: users answer a structured questionnaire, their responses are processed through a fixed algorithmic mapping, and a list of suggested occupations is returned. The sophistication of the questionnaire and the breadth of the occupational database have grown, but the absence of learning — of a model that adapts its behaviour based on accumulated evidence — means these systems cannot improve over time or produce meaningfully differentiated recommendations for users with subtly different profiles.

## 2.4 Machine Learning in Recommendation Systems

The application of machine learning to recommendation represents one of the most commercially significant and academically productive areas of applied artificial intelligence over the past two decades. Recommender systems are broadly classified into three paradigms: content-based filtering, collaborative filtering, and hybrid approaches (Ricci, Rokach, & Shapira, 2011). Content-based filtering recommends items whose attribute profiles are similar to items the user has previously engaged with positively. Collaborative filtering recommends items that users with historically similar preferences have found valuable. Hybrid systems combine signals from both approaches to mitigate their respective weaknesses.

The application of these paradigms to career guidance contexts presents specific challenges. Collaborative filtering, which drives recommendation in consumer contexts from Netflix to Spotify, requires a large base of users with documented preference histories to produce meaningful signals. In career guidance, such preference histories are sparse and structurally ambiguous: a user who has worked in three different careers does not straightforwardly provide supervision signal about which career they "preferred" in the way a user's viewing history signals content preferences. Career satisfaction is also highly context-dependent and individual, making the assumption that similar users will have similar preferences particularly fragile in this domain.

Content-based filtering is more tractable in career guidance contexts because it does not require historical preference data — it relies only on structured comparisons between user and item attributes. However, naive content-based systems that compute overlap between user-stated skills and career-required skills through simple set intersection lack the capacity to weight the relative importance of different features or to identify meaningful patterns in how combinations of attributes relate to compatibility. A user who shares three skills with a career but whose work preferences, industry interests, and availability are entirely misaligned may receive a higher "match" score from a naive content-based system than a genuinely suitable match whose skill overlap is smaller.

Machine learning addresses this limitation by learning, from training data, how to weight the relative importance of different features in predicting compatibility. Supervised approaches — where the model is trained on labelled examples of user-career pairs with known compatibility scores — have been explored in several academic studies. Shalaby et al. (2017) demonstrated that career trajectories could be modelled using recurrent neural networks trained on LinkedIn profile data, achieving meaningful accuracy in predicting a user's next career move from the sequence of previous roles. Decorte, Demeester, and Develder (2021) applied transformer-based language models to the job-candidate matching problem, demonstrating that semantic representations of job descriptions and candidate profiles enabled more nuanced matching than keyword-based approaches. Kenthapadi, Le, and Venkataraman (2017) documented LinkedIn's approach to talent recommendations, which combines collaborative and content-based signals at scale using gradient boosted trees.

The limitation common to these high-performing approaches is their dependence on large-scale real-world data — millions of user profiles, career histories, and preference signals accumulated over years of platform operation. Such data is not publicly available and was not available for this project. PathWise's machine learning architecture is designed to be appropriate for the available data: a supervised model trained on structured, curated career profile data using a knowledge distillation approach, producing a model that generalises the domain expert's understanding of career-profile compatibility rather than learning purely from observed user behaviour.

## 2.5 Conversational AI and Large Language Models in Advisory Contexts

The emergence of large language models (LLMs) with sophisticated natural language understanding and generation capabilities — represented most prominently by OpenAI's GPT series and Anthropic's Claude — has created new possibilities for conversational advisory applications that extend well beyond the scripted, rule-based chatbots that dominated the previous generation of digital advisors. LLMs can engage in open-ended, contextually coherent dialogue, adapt their register and complexity to the apparent sophistication of their interlocutor, synthesise information from multiple sources within a single response, and maintain conversational coherence across extended multi-turn interactions.

These capabilities have attracted significant research attention in educational technology contexts. Shridhar et al. (2023) demonstrated that LLM-based tutoring systems could provide adaptive feedback on student code submissions that was evaluated by students as more helpful than fixed rubric-based feedback. Kasneci et al. (2023) reviewed the implications of ChatGPT and related systems for education, identifying both transformative potential in personalised learning support and significant risks related to over-reliance, academic integrity, and the generation of plausible but incorrect information.

The generation of plausible but incorrect information — commonly termed hallucination — is the central technical risk in deploying LLMs for advisory purposes. In a career guidance context, hallucination might manifest as the invention of false salary figures, the fabrication of non-existent qualifications, or the misstatement of industry-specific requirements. For a user making significant life decisions based on the platform's guidance, such errors could have material consequences.

The primary technical strategies for hallucination mitigation in domain-specific LLM applications are retrieval-augmented generation (RAG) and system prompt engineering. In RAG architectures (Lewis et al., 2020), the model's context window is populated with information retrieved from a verified knowledge base before each response is generated, anchoring the model's outputs to documented facts. In system prompt engineering approaches, the model is given explicit instructions about the boundaries of its knowledge, the sources it may and may not draw upon, and the behaviours it must avoid. PathWise employs the system prompt engineering approach, assembling verified platform data into a structured context block that is injected into every AI interaction alongside explicit behavioural constraints.

## 2.6 Existing Platforms: A Comparative Analysis

The following table presents a comparative analysis of PathWise against four existing career guidance platforms: LinkedIn Career Explorer, Coursera's career recommendations feature, the UK National Careers Service, and CareerExplorer.

**Table 2.1: Comparative Analysis of Existing Career Guidance Platforms**

| Feature | LinkedIn Career Explorer | Coursera Career Recommendations | UK National Careers Service | CareerExplorer | PathWise |
|---|---|---|---|---|---|
| Personalised matching | Limited (network-based) | Moderate (learner history) | Low (questionnaire) | Moderate (psychometric) | High (ML model) |
| Interest-first onboarding | No | No | Partial | Yes | Yes |
| Non-traditional pathways | No | Partially (courses only) | Partially | No | Yes (4 pathway types) |
| Skill gap analysis | Limited | Limited | No | No | Yes |
| Personalised learning roadmap | No | Course sequences only | No | No | Yes (ML-generated) |
| AI conversational advisor | No | No | No | No | Yes (grounded) |
| Progress tracking | No | Yes | No | No | Yes |
| Free access | Requires account | Freemium | Yes | Freemium | Yes |
| Career library breadth | Very broad | Broad | Broad | Broad | 96 curated careers |
| Education stage adaptation | No | No | No | No | Yes (8 stages) |

LinkedIn Career Explorer provides occupational demand data and skills-based career path visualisations, but its recommendations are primarily driven by network proximity — what careers have people with similar profile titles transitioned into — rather than by an analysis of the individual user's interests and values. It is not designed as a guidance tool for users without an existing professional network.

Coursera's career recommendation feature is oriented toward learners who have already identified a learning goal, suggesting additional courses to complement their existing enrolments. It does not provide career matching from a blank-slate user profile, nor does it offer skill gap analysis or learning roadmaps outside the Coursera course catalogue. Its definition of career development is implicitly restricted to courses available on its platform.

The UK National Careers Service provides a broad, publicly funded career exploration tool that includes a questionnaire-based matching system and a large occupational database. However, the matching logic is rule-based rather than learned, the questionnaire does not adapt to the user's responses, non-traditional pathways are not prominently surfaced, and there is no AI advisory capability. It serves well as a directory of occupational information but provides limited personalisation.

CareerExplorer employs a psychometric questionnaire inspired by Holland's RIASEC model, which is well-validated theoretically. However, like most psychometric-based systems, it treats career matching as a personality typology problem rather than as a multi-dimensional compatibility challenge, and its recommendations do not incorporate skill gap analysis, personalised learning roadmaps, or alternative pathway frameworks.

## 2.7 Identified Gaps and Justification for PathWise

The review of theoretical frameworks and existing systems reveals a consistent set of gaps that PathWise is designed to address. Career guidance theory has, for decades, recognised the importance of individual variability, developmental continuity, and the multiplicity of valid career pathways. Existing digital implementations have not adequately reflected these insights.

The interest-first design of PathWise's onboarding, which uses activity-discovery cards to translate lived experience into career vocabulary before introducing career labels, addresses the documented failure of career-label-first interfaces to engage users who are genuinely uncertain about their direction. The ML-based matching system addresses the superficiality of rule-based recommendation. The grounded AI conversational advisor addresses the absence of continuous, contextually aware guidance in existing platforms. The alternative pathways framework addresses the systematic privileging of university routes. The progress tracking and profile update mechanisms address the transactional, one-event nature of most existing guidance interactions.

Together, these design choices represent not a marginal improvement over existing systems but a different conceptual model of what career guidance technology should be: a persistent, personalised, learning companion rather than a one-time assessment tool.

---

# CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN

## 3.1 Analysis of Existing Systems

Before the design of PathWise could begin in earnest, a thorough analysis of the limitations of existing systems was conducted. This analysis, grounded in the literature review and supplemented by hands-on evaluation of several widely used platforms, identified the following structural problems.

The most fundamental structural problem in existing systems is the conflation of career exploration with career selection. Most platforms present the user with a choice interface — select a career domain, select a skill, select an interest — before offering any guidance. This presupposes the very knowledge the user is seeking. A student who does not know whether they are more suited to data science or clinical psychology cannot meaningfully select "Data and AI" versus "Healthcare" as their starting point. The interface thus excludes the users who would benefit most from the platform's guidance.

The second structural problem is the separation of recommendation from action. Existing platforms typically produce a list of suggested careers without providing the user with a clear, personalised path from their current state to those careers. Knowing that data science is a good fit for your profile is useful only if you also know which of your existing skills are already relevant, which skills you need to develop, how long that development is likely to take given your availability, and where to begin. None of the platforms reviewed in Chapter Two provided this full pathway, from initial recommendation through skill gap analysis to learning roadmap, as a unified, personalised experience.

The third structural problem is the context-free nature of most digital career interactions. When a user returns to a career guidance platform with a follow-up question — "I looked into the UX design roadmap you suggested; is it realistic to complete it in six months while working part-time?" — there is no existing platform that can answer this question with reference to the user's specific skills, availability, and learning mode. The AI advisory capability of PathWise was designed specifically to solve this problem.

## 3.2 Proposed System Overview

PathWise proposes a career guidance system built around four integrated components: a structured career knowledge base of ninety-six professions, an ML-driven recommendation engine that scores career compatibility against user profiles, a personalised roadmap generator that produces phase-by-phase learning plans calibrated to individual skill levels and time availability, and a grounded AI conversational advisor that provides continuous, contextually aware guidance.

These components are tied together by a persistent user profile system that stores the individual's interests, skills, experience level, work preferences, availability, and career goals, and makes this data available to every component of the system in every interaction. The result is a platform that knows who the user is at every touchpoint and uses that knowledge to personalise every response, recommendation, and roadmap.

The system is designed for three distinct user types, whose needs differ significantly. Explorers are users who genuinely do not know what career direction to pursue. The system serves them through activity-based discovery, broad career exploration, and an AI advisor calibrated to use plain language, avoid jargon, and normalise uncertainty. Focused learners have identified one or more career directions and want to evaluate fit, understand requirements, and plan a learning journey. The system serves them through skill gap analysis, targeted roadmaps, and honest AI assessment of their readiness. Professionals are already working and want to advance within their current career, specialise, or pivot to a new direction. The system serves them with strategic, detail-rich AI guidance that assumes domain knowledge and focuses on credentialing, salary progression, and lateral moves.

## 3.3 Functional Requirements

The functional requirements of PathWise were determined through a combination of user journey mapping, analysis of the identified system gaps, and iterative design review. They are presented in Table 3.1.

**Table 3.1: Functional Requirements Specification**

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Users must be able to register with email/password or Google OAuth | Must Have |
| FR-02 | Authenticated users must be redirected to onboarding on first login | Must Have |
| FR-03 | Onboarding must collect name, experience level, work preferences, interests, skills, weak areas, work style, learning mode, availability, career goals, and industries | Must Have |
| FR-04 | Activity discovery cards must auto-seed interests on selection and remove them on deselection | Must Have |
| FR-05 | Each onboarding step must enforce minimum selection requirements before progression | Must Have |
| FR-06 | On onboarding completion, the system must generate and persist career recommendations | Must Have |
| FR-07 | Recommendations must include match score, match reasons, matching skills, and skill gaps for each career | Must Have |
| FR-08 | Users must be able to browse 96 careers filtered by sector | Should Have |
| FR-09 | Career detail pages must show salary, demand, required skills, tools, and progression roles | Should Have |
| FR-10 | Users must be able to generate a personalised learning roadmap for any career | Must Have |
| FR-11 | Roadmaps must present alternative pathways: university, self-taught, certification, freelance | Should Have |
| FR-12 | Users must be able to mark roadmap steps as complete and have progress persist | Must Have |
| FR-13 | The AI chat advisor must answer career questions grounded in the user's platform data | Must Have |
| FR-14 | The AI advisor must adapt communication style to the user's experience level | Must Have |
| FR-15 | Users must be able to update their profile and regenerate recommendations | Should Have |
| FR-16 | Users must be able to submit thumbs up/down feedback on recommendations | Could Have |
| FR-17 | The system must send a welcome email on successful registration | Should Have |
| FR-18 | Users must be able to request a password reset by email | Must Have |

## 3.4 Non-Functional Requirements

**Table 3.2: Non-Functional Requirements Specification**

| ID | Requirement | Metric |
|---|---|---|
| NFR-01 | Page load time for cached routes | < 200ms at edge |
| NFR-02 | Recommendation generation (ML path) | < 10s end-to-end |
| NFR-03 | Roadmap generation (first time) | < 30s with graceful timeout |
| NFR-04 | Chat response (first token streamed) | < 3s |
| NFR-05 | All user inputs must be sanitised and validated server-side | 100% coverage |
| NFR-06 | Session cookies must be httpOnly, Secure, SameSite=Lax | Always |
| NFR-07 | All API routes must verify session before processing | 100% coverage |
| NFR-08 | Rate limiting must be applied to expensive endpoints | Recommendations: 5/10min; Chat: 20/1min |
| NFR-09 | The system must remain available if the ML API is unreachable | Claude fallback always available |
| NFR-10 | TypeScript compilation must pass with strict mode enabled | Build-time enforcement |
| NFR-11 | Error monitoring must be active in production | Sentry integration |
| NFR-12 | All environment secrets must be stored in Cloudflare Worker secrets | No plaintext secrets in code |

## 3.5 System Architecture

The architecture of PathWise is distributed across five distinct components, each with a well-defined role and interface.

The first component is the Next.js 15 application layer, which handles both the user-facing frontend and the server-side API logic. The frontend is built with React 19 using the App Router paradigm, which enables fine-grained mixing of server and client components at any level of the component tree. Server components handle initial page rendering without client-side JavaScript, improving performance and security. Client components manage interactive state — onboarding form steps, chat message threads, roadmap step toggles, career library filters. API routes, implemented as Next.js route handlers, provide all server-side business logic: authentication verification, recommendation generation, roadmap generation, chat processing, and data access.

The second component is the Cloudflare Workers runtime. The Next.js application is compiled and bundled for deployment to Cloudflare Workers using the OpenNext adapter (`@opennextjs/cloudflare`), which translates Next.js server components and API routes into Cloudflare-compatible Worker handlers. Cloudflare Workers operates on V8 isolates — lightweight, fast-starting JavaScript execution environments distributed across Cloudflare's global network of over three hundred data centres. Unlike traditional serverless architectures such as AWS Lambda, Cloudflare Workers has no cold-start penalty and runs at the network edge, delivering responses from the point of presence geographically nearest to each user.

The third component is the scikit-learn Python API. A Python FastAPI service hosts the trained machine learning model and two endpoints: one for career recommendation prediction (`/predict`) and one for personalised roadmap generation (`/roadmap`). This service runs on Render's managed container infrastructure and is called by the Next.js API routes with defined timeout limits (eight seconds for recommendations, twenty-five seconds for roadmap generation). The separation of the ML service from the Next.js application is a deliberate architectural decision that enables the model to be retrained, versioned, and deployed independently of changes to the web application.

The fourth component is the Anthropic Claude API, which provides generative AI capabilities for two distinct purposes: recommendation generation as a fallback when the ML service is unavailable (using Claude Haiku for cost efficiency), and the conversational career advisor (using Claude Sonnet for superior reasoning quality). Claude is accessed exclusively through server-side API routes; the Anthropic API key is never exposed to the client.

The fifth component is Airtable, which serves as the persistent data store for all user data: profiles, recommendations, roadmaps, progress, and feedback. All access is via the Airtable REST API using raw `fetch` calls, without the `airtable` npm package, ensuring full compatibility with Cloudflare Workers' edge runtime which does not support Node.js-specific packages.

**Figure 3.1 (described textually):** The high-level system architecture of PathWise shows the browser client at the top left communicating with the Cloudflare Workers edge network. The Worker serves Next.js pages and API routes. API routes communicate outward to four external services: Firebase Admin SDK for token verification, the scikit-learn Python API on Render for ML predictions, the Anthropic Claude API for AI responses, and the Airtable REST API for data persistence. Firebase Authentication SDK runs in the browser, fetching its configuration from the `/api/firebase-config` Worker endpoint at runtime.

## 3.6 Database Design

PathWise uses Airtable as its database, structured into five tables that together capture all persistent state for the platform.

**Table 3.3: Airtable Profiles Table Schema**

| Field | Airtable Type | Description |
|---|---|---|
| userId | Single line text | Firebase UID — primary lookup key |
| name | Single line text | User's display name |
| email | Email | User's email address |
| educationStage | Single line text | jhs_student / shs_student / tvet_student / polytechnic_student / university_student / graduate / working_professional / career_switcher |
| currentProgram | Single line text | User's current course, programme, or specialisation |
| academicBackground | Long text | Optional free-text summary of academic history |
| preferredNextStep | Single line text | university / tvet / work / certification / entrepreneurship / postgraduate / not_sure |
| certificationInterest | Single line text | "true" or "false" — stored as string (Airtable limitation) |
| entrepreneurialInterest | Single line text | "true" or "false" — stored as string (Airtable limitation) |
| experienceLevel | Single line text | explorer / focused / professional (derived from educationStage for ML API compatibility) |
| workPreferences | Long text | JSON array of selected work type preferences |
| interests | Long text | JSON array of interest strings |
| skills | Long text | JSON array of skills the user has |
| weakAreas | Long text | JSON array of skills the user feels weak in |
| workStyle | Single line text | remote / hybrid / office / flexible |
| learningMode | Single line text | self_paced / structured / bootcamp / university / mentorship |
| availabilityPerWeek | Single line text | full_time / part_time / evenings / weekends / limited |
| careerGoals | Long text | JSON array of career goal strings |
| industries | Long text | JSON array of industry interest strings |
| createdAt | Date | ISO timestamp — set on creation |
| updatedAt | Date | ISO timestamp — updated on every write |

Long text fields that store JSON arrays reflect a design trade-off: Airtable does not natively support array fields, so complex multi-value data is serialised to JSON strings on write and deserialised on read. The `deserializeProfile` function in `src/lib/airtable/client.ts` handles this consistently for all profile fields.

**Table 3.4: Airtable Recommendations Table Schema**

| Field | Airtable Type | Description |
|---|---|---|
| userId | Single line text | Firebase UID |
| careerId | Single line text | Career ID matching CAREERS_DATA |
| careerTitle | Single line text | Career display name |
| matchScore | Number | Compatibility score 0–100 |
| matchReasons | Long text | JSON array of reasoning strings |
| matchingSkills | Long text | JSON array of matched skills |
| skillGaps | Long text | JSON array of missing skills |
| source | Single line text | ml or claude |
| generatedAt | Date | ISO timestamp |

**Table 3.5: Airtable Roadmaps Table Schema**

| Field | Airtable Type | Description |
|---|---|---|
| userId | Single line text | Firebase UID |
| careerId | Single line text | Career identifier |
| roadmapJson | Long text | Full serialised PersonalizedRoadmap JSON |
| generatedAt | Date | ISO timestamp |

**Table 3.6: Airtable RoadmapProgress Table Schema**

| Field | Airtable Type | Description |
|---|---|---|
| userId | Single line text | Firebase UID |
| careerId | Single line text | Career identifier |
| completedSteps | Long text | JSON array of completed step ID strings |
| updatedAt | Date | ISO timestamp |

## 3.7 Authentication Flow

The authentication architecture implements a two-layer pattern that separates identity verification from session management, providing both security and performance advantages.

When a user initiates sign-in — whether through email and password or Google OAuth — the Firebase Authentication Client SDK handles the credential exchange and identity verification entirely within the browser. The SDK is initialised lazily using configuration fetched at runtime from the `/api/firebase-config` server endpoint, which reads Firebase configuration values from Cloudflare Worker secrets. This pattern was necessitated by the incompatibility between Next.js's build-time variable baking (required for `NEXT_PUBLIC_*` variables) and Cloudflare Workers' runtime-only secret injection.

On successful authentication, Firebase returns a short-lived ID token — a signed JSON Web Token valid for one hour — which the browser submits to the PathWise server via `POST /api/auth/session`. The server verifies this token using the Firebase Admin SDK, extracts the user's identifier and profile information, then creates and signs a PathWise-specific JWT (valid for seven days) using the `jose` library. This session JWT is stored as an `httpOnly`, `Secure`, `SameSite=Lax` cookie named `pathwise_session`.

All subsequent requests to protected routes include this cookie automatically. The middleware function — which executes on every request before it reaches any route handler — reads the cookie, verifies the JWT signature using the application's `JWT_SECRET`, and either allows the request to proceed or redirects to the login page with the original path preserved. The `getSession()` helper function, called within individual API route handlers, provides access to the verified session payload without requiring an external network call to Firebase.

## 3.8 Recommendation Engine Architecture

The recommendation engine is designed with a primary path using the scikit-learn ML model and a fallback path using Claude AI, ensuring that recommendation generation is always available regardless of the ML service's status.

When a user completes onboarding or explicitly requests recommendation regeneration, the system submits the user's sanitised profile to `POST /api/recommendations`. The route first attempts to call the Python ML API at `ML_API_URL/predict`, passing the profile as a structured JSON object and requesting the top eight career predictions. The ML API responds with a ranked list of career titles, confidence scores (on a zero-to-one scale), and feature-importance reasoning strings. The API route then maps these predictions to career records in the static CAREERS_DATA catalogue, computes skill overlap and skill gaps through fuzzy string matching, converts the confidence scores to percentage values, and persists the results to both Airtable and an in-memory store.

If the ML API is unreachable or returns an error, the system falls back to Claude Haiku, passing the same profile data and requesting a JSON-formatted list of career recommendations in a structure identical to that returned by the ML API. The source field on persisted recommendation records is set to either `ml` or `claude`, allowing the system to track the fallback rate over time.

## 3.9 AI Chat Workflow

The AI chat system transforms a user's natural language question into a grounded, contextually rich response through a three-stage pipeline. The first stage is intent detection: a deterministic, regex-based classifier analyses the user's message and determines which of six intent categories it most likely belongs to — career match queries, career detail requests, roadmap queries, skill gap analyses, career comparisons, or recommendation explanations. Alongside intent detection, a career entity extractor scans the message for mentions of any of the ninety-six careers in the knowledge base.

The second stage is parallel tool execution. Based on the detected intent and identified careers, the system executes the relevant data-fetching tools in parallel using `Promise.all`. The user's profile is always loaded. Intent-specific data — top career matches, career details, a stored roadmap, skill gap computation, career comparison, or recommendation explanation — is loaded in parallel where tools are independent and sequentially where results from one tool are required as input to another.

The third stage is prompt assembly and generation. The tool results are formatted into a structured `<platform_context>` block — a human-readable summary of the platform data relevant to this user's query — and appended to the base system prompt, which establishes the AI's persona, behavioural constraints, and experience-level calibration rules. Claude Sonnet then generates a response grounded in this context, streaming tokens back to the browser as they are produced.

## 3.10 Roadmap Generation Workflow

Learning roadmap generation follows a cache-first pattern. When a user requests a roadmap for a specific career, the system first queries Airtable for a previously cached roadmap for that user-career combination. If one exists, it is returned immediately (with YouTube search links enriched for video and course resources). If no cache exists, the system queries Airtable for the user's recommendation records to obtain their matching skills and skill gaps for the target career, queries their profile for learning mode and availability preferences, and then calls the ML Python API's `/roadmap` endpoint with this data.

The ML API returns a structured roadmap object comprising phases (each with a title, duration, skills covered, and step list) and steps (each with a title, description, and resource list). The Next.js API route normalises the snake_case response to camelCase, enriches resource entries without URLs with YouTube search links, and stores the complete roadmap as a serialised JSON string in Airtable. The response is then returned to the client.

## 3.11 API Structure

**Table 3.7: API Endpoints Reference**

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| /api/firebase-config | GET | Returns Firebase client configuration | No |
| /api/auth/session | POST | Creates session cookie from Firebase ID token | No |
| /api/auth/login | POST | Email/password auth via Firebase Admin | No |
| /api/auth/register | POST | Creates Firebase user + sends welcome email | No |
| /api/auth/logout | POST | Clears session cookie | Yes |
| /api/auth/forgot-password | POST | Sends password reset email via Resend | No |
| /api/profile | GET | Returns user profile from Airtable | Yes |
| /api/profile | POST | Upserts user profile to Airtable | Yes |
| /api/recommendations | GET | Returns stored recommendations | Yes |
| /api/recommendations | POST | Generates and stores recommendations | Yes |
| /api/careers | GET | Returns all career records | No |
| /api/careers/[id] | GET | Returns single career record | No |
| /api/roadmap/[careerId] | GET | Returns cached or generated roadmap | Yes |
| /api/roadmap/[careerId] | POST | Saves progress (completed step IDs) | Yes |
| /api/roadmap/[careerId] | DELETE | Clears cached roadmap | Yes |
| /api/stage-recommendations | GET | Returns education-stage-aware recommendation object | Yes |
| /api/chat | POST | Runs agent pipeline, streams Claude response | Yes |
| /api/feedback | POST | Records thumbs up/down feedback | Yes |

## 3.12 Security Design

Security in PathWise is implemented at four layers. At the perimeter, the Cloudflare Workers runtime provides DDoS protection, SSL termination, and bot filtering as part of the platform infrastructure. At the application layer, the global middleware function enforces session verification on all protected routes before any route handler logic executes, ensuring that unauthenticated requests cannot reach any application code beyond the middleware itself.

At the data layer, all user-submitted inputs pass through a sanitisation module (`sanitise.ts`) before any processing. String arrays are validated for type and capped at fifty elements. Individual strings are trimmed and capped at five hundred characters. Enumerated fields are validated against their allowed value sets with a safe default returned for invalid inputs. This prevents both injection attacks and denial-of-service through oversized payloads.

At the secrets layer, all credentials — Firebase configuration, Airtable API key, Anthropic API key, JWT secret, Resend API key — are stored as Cloudflare Worker secrets, encrypted at rest and injected into the Worker's environment at runtime. No secrets appear in the source code or in environment files committed to version control. The `/api/firebase-config` endpoint, which serves Firebase configuration to the browser, does not require authentication and returns only the values that the Firebase Client SDK legitimately needs and that Firebase's own security rules are designed to work with.

---

# CHAPTER FOUR: SYSTEM IMPLEMENTATION AND TESTING

## 4.1 Development Methodology

PathWise was developed using an iterative, feature-driven methodology appropriate for a solo final year project with a fixed submission deadline. Development was organised into four phases: architecture and foundation (authentication, database connectivity, core API routes, and deployment pipeline), core features (onboarding, recommendation engine, career library, and dashboard), advanced features (roadmap generation, AI chat, skill gap analysis, and profile management), and polish and evaluation (UI refinement, alternative pathways, interest discovery mode, and comprehensive testing).

Version control was managed through Git with a single main branch, with commits made at meaningful functional milestones rather than on a time-based schedule. The GitHub repository served as both the source of truth for the codebase and the deployment trigger for the Python ML API on Render. The Next.js application was deployed manually to Cloudflare Workers using the `npm run deploy` command, which chains the Next.js build, the OpenNext compilation, and the Wrangler deployment tool.

TypeScript's static type system was used as a continuous design enforcement mechanism throughout development. The `tsconfig.json` enables `strict: true`, which activates all strict type checks including `strictNullChecks`, `noImplicitAny`, and `strictFunctionTypes`. Build failures caused by type errors — of which there were numerous during the iterative expansion of the data model and API contracts — were treated as design feedback rather than obstacles, leading to more robust interface definitions and more explicit data flow through the application.

## 4.2 Frontend Implementation

The frontend is built with Next.js 15's App Router, React 19, TypeScript, and Tailwind CSS. The application is divided into three route groups: the public landing page and auth pages (login, register, forgot password), the authenticated dashboard pages (careers, onboarding, roadmap, chat, profile, dashboard), and the API routes.

The onboarding flow, implemented in `src/app/(dashboard)/onboarding/page.tsx`, is the most interaction-intensive component in the system. It manages a six-step form, each step with its own validation logic and minimum completion requirements. The `canProceed()` function evaluates the current step and the form state and returns a boolean that gates the "Continue" button. The `TagInput` component provides autocomplete-from-suggestions functionality for interests, skills, and weak areas.

Step 1 — "Your Stage" — is the most significant structural addition in the current iteration. It presents a full-name input field followed by a two-column grid of eight education-stage cards (JHS Student, SHS Student, TVET Student, Polytechnic Student, University Student, Graduate, Working Professional, Career Switcher). Each card is colour-coded with a border and carries an icon, label, and description. Selecting a card reveals a conditional form field whose prompt adapts to the selected stage: SHS students see a subject-combination dropdown mapped to Ghana's seven programme tracks; TVET students see a specialisation selector; university and polytechnic students see a degree-programme selector from `UNIVERSITY_TRACKS`; working professionals and career switchers see a current-role text input. Students and polytechnic students additionally see toggles for certification interest and entrepreneurship interest. The complete form state is serialised to `localStorage` as a draft on every field update, enabling re-entry without data loss on page refresh.

Step 6 — "Goals" — includes a `preferred_next_step` selector (university, TVET, find work, certification, entrepreneurship, postgraduate study, not sure) alongside career goals and industries. This data populates the stage recommendation engine and the AI advisor context.

The activity discovery cards, introduced in onboarding Step Three, are the most pedagogically significant UI element in the platform. Each of the nine cards is defined by an object containing an icon, a label, a description, and a seed array of interest strings. When a card is selected, the `toggleActivity` function adds the card's seeds (excluding any already present) to the interest list. When deselected, it removes the seeds added by that card. This bidirectional seeding and unseeding behaviour required careful state management to avoid incorrectly removing interests that the user had added manually and that happened to share a value with a card's seed array.

The career library page, implemented in `src/app/(dashboard)/careers/page.tsx`, uses the `CATEGORY_TO_SECTOR` mapping from the types library to group the ninety-six careers into ten sector categories dynamically, computing sector counts and filtering the display in response to sector pill clicks. The two-level hierarchy — twenty-eight category values mapped to ten sector labels — was computed at runtime without requiring any changes to the underlying career data objects, demonstrating the value of a well-designed computed mapping over storing redundant taxonomy fields.

The roadmap detail page manages complex, multi-level interactive state: phase expansion, step completion toggles, progress persistence, and the alternative pathways tab selection. Phase and step card components are implemented as standalone functions with their own local state for expansion, delegating completion toggle events up to the page-level handler that manages the `Set<string>` of completed step IDs and triggers the Airtable persistence call.

## 4.3 Backend and API Implementation

The API routes, each implemented as a Next.js route handler in the `src/app/api/` directory, follow a consistent pattern: session verification via `getSession()`, input parsing and sanitisation, business logic execution (which may involve Airtable queries, ML API calls, or AI generation), and JSON response construction. Error handling at each layer produces appropriate HTTP status codes — 401 for authentication failures, 400 for malformed input, 429 for rate limit violations, 500 for internal errors — with descriptive error messages that assist debugging without exposing implementation details.

The recommendations API route demonstrates the full fallback architecture. After session verification and input sanitisation, it calls `generateMLRecommendations()` from the ML bridge module. This function calls the Python API with an eight-second `AbortSignal.timeout()`, normalises the response, and returns the results. If the function returns null (indicating API unavailability), the route falls back to `generateAIRecommendations()`, which calls Claude Haiku with the same profile data. Both paths converge on the same enrichment and persistence logic, ensuring that the downstream experience is identical regardless of which recommendation source was used.

The chat API route implements streaming response delivery using the WHATWG Streams API, which is natively supported by the Cloudflare Workers runtime. Claude's streaming response is piped through a `ReadableStream` whose data chunks are forwarded to the client as they arrive, enabling the progressive display of AI responses in the chat interface. The streaming approach significantly improves perceived response time by showing the beginning of the response within one to three seconds even when the complete response takes considerably longer to generate.

## 4.4 Authentication Implementation

The Firebase Client SDK's lazy initialisation pattern — implemented in `src/lib/firebase/client.ts` — deserves detailed documentation as a novel engineering solution to a genuine architectural problem.

The standard approach to initialising the Firebase Client SDK is to call `initializeApp()` at module load time with configuration values read from `NEXT_PUBLIC_*` environment variables. On Cloudflare Workers, where `NEXT_PUBLIC_*` variables must be baked into the JavaScript bundle at build time but Cloudflare secrets are only available at runtime, this standard approach produces an `auth/invalid-api-key` error because the configuration values are undefined in the bundle.

The solution implemented in PathWise exports a single function, `getFirebase()`, which returns a Promise that resolves to the Firebase Auth instance and GoogleAuthProvider. On first call, the function fetches `/api/firebase-config`, initialises the Firebase app with the returned configuration, creates the Auth instance, and stores the result in a module-level variable. On subsequent calls, it returns the already-resolved Promise immediately. Auth pages call `getFirebase()` within a `useEffect` hook on component mount to pre-warm this Promise, ensuring that by the time the user initiates a sign-in interaction, the Promise has already resolved and the subsequent `await getFirebase()` call in the event handler returns synchronously from the cached result.

## 4.5 Machine Learning Implementation

The ML model is trained using scikit-learn's ensemble methods on a structured tabular dataset generated through the knowledge distillation approach described in Chapter Three. The feature engineering transforms user profile data into a high-dimensional binary/ordinal feature vector that captures interests, skills, work preferences, work style, learning mode, availability, career goal keywords, and industry preferences.

**Table 4.1: ML User Profile Feature Vector Description**

| Feature Group | Encoding | Dimensionality |
|---|---|---|
| Interests | Multi-hot over ~60 interest categories | 60 |
| Skills (have) | Multi-hot over ~60 skill categories | 60 |
| Skills (weak) | Multi-hot over ~60 skill categories | 60 |
| Work preferences | Multi-hot over 6 preference types | 6 |
| Work style | One-hot over 4 style options | 4 |
| Learning mode | One-hot over 5 mode options | 5 |
| Availability | Ordinal encoding (1–5) | 1 |
| Career goal keywords | Multi-hot over keyword vocabulary | Variable |
| Industry interests | Multi-hot over 19 industries | 19 |

The trained model is serialised using Python's `joblib` library and served via a FastAPI endpoint. At inference time, the Python service deserialises the model, transforms the incoming profile JSON into the feature vector format used during training, generates a prediction for each career in the knowledge base, sorts the predictions by score, and returns the top-N results with feature-importance-derived reasoning strings.

The skill gap computation is performed in the Next.js API layer rather than the Python service, applying fuzzy substring matching between user skill strings and career required skill strings. This ensures skill gap results reflect the exact skill vocabulary used in the user's profile rather than requiring the Python service to maintain a copy of the career data.

## 4.6 AI Integration

The AI agent pipeline, implemented across five modules in `src/lib/agent/`, represents the most architecturally sophisticated component of the platform. The intent detection module (`intent.ts`) maintains a registry of regex pattern groups, one per intent category, and a career entity extractor that scans messages for matches against the career title vocabulary. The runner module (`runner.ts`) orchestrates parallel tool execution using `Promise.all`, ensuring that independent data fetches — profile, top matches, career details, and roadmap — are retrieved concurrently rather than sequentially, reducing the total tool execution time from the sum of individual call durations to approximately the duration of the slowest single call.

The system prompt module (`system-prompt.ts`) defines a base persona prompt of approximately one thousand words that establishes the AI advisor's identity, behavioural constraints, experience-level adaptation rules, and content guardrails. This base prompt is assembled once and reused across all interactions, with the per-user, per-query `<platform_context>` block assembled fresh for each request from the tool results. The combined prompt reliably fits within the context window of Claude Sonnet while providing sufficient grounding data to enable accurate, personalised responses.

## 4.7 Roadmap System Implementation

The roadmap system required the resolution of a significant technical challenge: the ML API's roadmap endpoint can take up to twenty-five seconds to respond on first generation (longer if the Render service has been idle and is recovering from a cold start), which approaches or exceeds typical serverless function timeout limits. The solution implemented in PathWise is a `Promise.race()` between the roadmap generation call and a twenty-five-second timeout promise, returning a user-friendly "generation timed out, please try again" response if the generation does not complete in time. Subsequent requests will typically succeed as the roadmap service is now warm. Generated roadmaps are cached in Airtable so that the slow generation step occurs at most once per user-career combination.

The alternative pathways section on the roadmap page is generated entirely client-side from the career title string — no API call is required. The `computePathways()` function returns four pathway objects, each containing an icon, label, duration, introductory sentence, and five numbered actionable steps, with the career title interpolated into the relevant text fields. The interactive tab-selection UI uses local component state to track which pathway is currently displayed, updating instantly on selection without any network interaction.

## 4.8 Database Operations

All Airtable operations are centralised in `src/lib/airtable/client.ts`, which exports typed helper functions for each table operation: `getProfile`, `upsertProfile`, `getRecommendations`, `saveRecommendations`, `getRoadmap`, `saveRoadmap`, `deleteRoadmap`, `getProgress`, `saveProgress`, and `saveFeedback`. Each function constructs the appropriate REST API call using the shared `airtableFetch` helper, which appends authorisation headers and base ID to every request and throws a typed error on non-200 responses.

The upsert pattern — query for an existing record, update if found, create if not — is used for profiles, roadmaps, and progress records, ensuring idempotency. The full-replace pattern — delete all existing records for a user, then insert new ones — is used for recommendations, ensuring that the cached recommendations always reflect the most recent generation. The Airtable API does not support batch deletes or upsert in a single operation, so these patterns require multiple API calls, which is reflected in the response time for operations that modify these tables.

## 4.9 Deployment

The deployment pipeline for PathWise consists of three sequential steps executed by the `npm run deploy` command. The first step runs `next build`, which compiles the TypeScript source, performs type checking (failing the build on any type error), applies route optimisations, and produces the `.next/` output directory. The second step runs `opennextjs-cloudflare build`, which reads the `.next/` output and transforms it into a Cloudflare Workers-compatible bundle at `.open-next/worker.js`. The third step runs `wrangler deploy`, which uploads the worker bundle to Cloudflare, deploys it atomically to the global edge network, and returns the deployment URL and version ID.

The Python ML API is deployed separately to Render via a Git-linked deployment pipeline that rebuilds and redeploys the Python FastAPI service on every push to the ML API repository. The two deployments are independent: changes to the Next.js application do not affect the Python service, and vice versa.

**Table 4.7: Observed System Performance Metrics**

| Operation | Observed Response Time |
|---|---|
| Static page load (landing, cached) | < 200ms |
| Dashboard page load (Airtable read) | 800ms – 1.5s |
| Recommendation generation (ML path) | 3s – 8s |
| Recommendation generation (Claude fallback) | 5s – 15s |
| Roadmap generation (first time, Render warm) | 10s – 20s |
| Roadmap generation (first time, Render cold) | 25s – 35s (may timeout) |
| Roadmap load (Airtable cache hit) | 1s – 2s |
| Chat response (first streamed token) | 1s – 3s |
| Chat response (full stream complete) | 5s – 15s |

## 4.10 Testing

Testing was conducted at four levels: compile-time type checking, functional path testing, regression testing for identified bugs, and manual exploratory testing of the complete user journey.

**Table 4.2: Authentication Test Results**

| Test Case | Expected | Result |
|---|---|---|
| Register with valid email and password | Account created, welcome email sent, redirect to onboarding | Pass |
| Register with an existing email | Error: account already exists | Pass |
| Register with password under 8 characters | Validation error before submission | Pass |
| Login with correct credentials | Session cookie set, redirect to dashboard | Pass |
| Login with incorrect password | Friendly error message | Pass |
| Google OAuth — new user | Account created, redirect to onboarding | Pass |
| Google OAuth — existing user | Session set, redirect to dashboard | Pass |
| Password reset email request | Resend delivers email with working link | Pass |
| Access protected route without session | Redirect to /login with return path | Pass |
| Access /login while authenticated | Redirect to /dashboard | Pass |

**Table 4.3: Onboarding and Profile Test Results**

| Test Case | Expected | Result |
|---|---|---|
| Attempt to continue from Step 2 with no selection | Continue button disabled | Pass |
| Select activity card in Step 3 | Seeds added to interest list | Pass |
| Deselect activity card | Seeds removed from interest list | Pass |
| Add custom interest not in suggestion list | Interest added via tag input | Pass |
| Select SHS Student stage | Subject-combination dropdown revealed | Pass |
| Select TVET Student stage | Specialisation field revealed | Pass |
| Select University stage | Degree-programme selector revealed | Pass |
| Select Working Professional | Free-text current-role field revealed | Pass |
| Toggle certification interest | State updated correctly | Pass |
| Submit onboarding | Profile saved with educationStage and all new fields, recommendations generated, stage panel shown on dashboard | Pass |
| Update profile from profile page | Airtable record updated, dashboard reflects changes | Pass |

**Table 4.4: Recommendation Engine Test Results**

| Test Case | Expected | Result |
|---|---|---|
| ML API available on recommendation request | Recommendations from ML, source="ml" | Pass |
| ML API unavailable (simulated) | Fallback to Claude, source="claude" | Pass |
| Rate limit exceeded on recommendation endpoint | 429 response with Retry-After header | Pass |
| Second dashboard load | Recommendations served from Airtable, no ML call | Pass |
| Feedback button (thumbs up) | Record created in Airtable Feedback table | Pass |

**Table 4.5: Roadmap System Test Results**

| Test Case | Expected | Result |
|---|---|---|
| First roadmap request for a career | ML API called, roadmap generated and cached | Pass |
| Second roadmap request for same career | Cached roadmap returned without ML call | Pass |
| Regenerate button clicked | Cache deleted, ML API called, fresh roadmap generated | Pass |
| Mark step as complete | Airtable progress record updated, checkmark shown | Pass |
| Mark step as incomplete | Progress record updated, step reverts to unchecked | Pass |
| Alternative pathway tab switch | Correct content shown for selected pathway | Pass |
| Chat link at bottom of roadmap | Navigates to chat page | Pass |

**Table 4.6: AI Chat Advisor Test Results**

| Test Case | Expected Intent and Result |
|---|---|
| "What careers suit me?" | getTopCareerMatches; response cites user's specific top matches | Pass |
| "Tell me about data science" | getCareerDetails; salary, skills, and demand surfaced | Pass |
| "How do I become a data scientist?" | getRoadmap + getCareerDetails; actionable path described | Pass |
| "Compare data science and software engineering" | compareCareers; direct comparison with recommendation | Pass |
| "Why was UX designer recommended?" | explainRecommendation; match reasons and score explained | Pass |
| "What's the weather today?" | No career intent; gentle redirect to career guidance | Pass |

## 4.11 Challenges and Solutions

The most significant technical challenge encountered during development was the Firebase API key issue described in Section 4.4. The challenge required a fundamental rethinking of how client-side Firebase configuration is managed in an edge computing deployment context, leading to the novel `/api/firebase-config` server-side configuration endpoint pattern that is documented in detail in Chapter Three.

A second challenge was the incompatibility of the standard `airtable` npm package with the Cloudflare Workers runtime, which does not support several Node.js globals that the package depends on. The solution was to implement all Airtable interactions using native `fetch` calls against the Airtable REST API, without any third-party SDK dependency. This required more code than the SDK approach but produced a lighter, fully edge-compatible implementation.

A third challenge was managing the cold-start latency of the Render-hosted ML API. Render's free tier suspends idle services after periods of inactivity, leading to cold-start times of up to thirty seconds on the first request following an idle period. The timeout-and-cache architecture — the twenty-five-second `Promise.race()` for roadmap generation and the Airtable-based caching system — mitigates the user impact of this latency by ensuring it occurs at most once per user-career combination and returning a graceful timeout message when it cannot be avoided.

---

# CHAPTER FIVE: SUMMARY, CONCLUSION, AND RECOMMENDATIONS

## 5.1 Project Summary

PathWise is a production-deployed, AI-powered career guidance platform developed as a final year undergraduate Computer Science project. The platform addresses documented failures in existing career guidance systems through a combination of machine learning-driven career matching, grounded generative AI advisory, interest-first onboarding, personalised learning roadmaps, and an explicit alternative pathways framework. It is accessible to real users at https://pathwise.mr-asanteeprog.workers.dev, built on Cloudflare's global edge network, and backed by a Python machine learning service, Anthropic's Claude API, Firebase Authentication, Airtable, and Resend.

The development of PathWise spanned the full software engineering lifecycle, from requirements analysis and system design through implementation, testing, and production deployment. The resulting system is not a prototype or a demonstration — it is a functioning platform capable of onboarding real users, generating meaningful career recommendations, producing personalised learning roadmaps, and providing contextually aware AI career guidance.

## 5.2 Achievements

The project has achieved all six of its stated objectives. A trained scikit-learn machine learning model has been implemented, deployed, and integrated with the platform as the primary recommendation engine, with a Claude Haiku fallback ensuring continuous availability. A career knowledge base of ninety-six professions across ten sectors has been developed and is successfully used for both ML feature comparison and user-facing presentation. A six-step onboarding system has been built that collects sufficient profile data for meaningful recommendation, beginning with an education-stage selector that supports eight distinct positions in Ghana's educational hierarchy.

The education-stage-aware recommendation engine (`stage-engine.ts`) produces discriminated-union recommendation objects — JHS, SHS, TVET, University/Polytechnic, Graduate, Professional, and Switcher — each carrying stage-specific guidance: SHS students receive tertiary programme comparisons and WASSCE subject advice; TVET students receive COTVET certification tracks and entrepreneurship pathways; university students receive internship and specialisation recommendations; graduates receive National Service strategy and graduate trainee programme advice. The AI conversational advisor is grounded in Ghana's specific educational context, referencing BECE, WASSCE, SHS programme tracks, Ghanaian professional bodies, and major institutions by name. Personalised learning roadmaps are being generated successfully by the ML service, cached in Airtable, and presented alongside the alternative pathways framework. The platform is deployed on Cloudflare Workers and has been verified to serve users correctly under production conditions.

## 5.3 System Strengths

PathWise demonstrates several notable strengths relative to the existing landscape of career guidance tools.

Its interest-first onboarding architecture is, to the best of the author's knowledge, unique among production-deployed career guidance platforms. The activity discovery cards in onboarding Step Three enable users who have no career vocabulary to begin the guidance process in terms they understand — the activities they enjoy — and receive meaningful recommendations without having to navigate a career taxonomy they have not yet acquired.

The grounded AI advisor architecture represents a responsible implementation of LLM-based advisory capability. By assembling verified platform data into the model's context for every interaction, and by explicitly instructing the model to distinguish between platform-verified information and general knowledge, the system substantially reduces the hallucination risk that makes ungrounded LLM advisors unreliable in consequential decision contexts.

The alternative pathways framework addresses a genuine gap in existing systems. By presenting university, self-taught, certification, and freelance routes to every career with equal visual weight and substantive actionable content, PathWise operationalises the theoretical argument that non-traditional pathways are legitimate, achievable, and worthy of prominent presentation — an argument long made in vocational psychology but rarely implemented in digital guidance tools.

The edge deployment architecture, while primarily a performance and scalability decision, also demonstrates the feasibility of building and deploying sophisticated AI-integrated applications on modern edge infrastructure as a solo academic project. This has implications for the broader field of student-built EdTech projects, suggesting that the barrier to production deployment has fallen substantially with the emergence of managed edge platforms.

## 5.4 Limitations

The most significant limitation of PathWise as currently implemented is the static nature of its career knowledge base. Salary ranges, demand levels, required skills, and recommended tools were accurate at the time of data curation but will drift from labour market reality over time. Without a mechanism for scheduled data refresh — either through automated integration with labour market data sources or through a structured manual review process — the platform's recommendations will become progressively less accurate as the labour market evolves.

The machine learning model's training on synthetic data, while a pragmatically justified approach given the absence of real-world career outcome data, produces a model that reflects the author's domain knowledge rather than the complexity of actual user diversity. Users whose profiles are unusual — highly specific interest combinations, non-standard skill sets, or career goals that cut across conventional sector boundaries — may find that the model's recommendations are less precisely differentiated than those received by users whose profiles more closely match the career archetypes encoded in the training data.

The in-memory rate limiter's inability to enforce consistent limits across multiple Worker isolates is a known deficiency. While the rate limit values are set conservatively enough that ordinary user behaviour will not trigger them, a determined user who understands the Cloudflare Workers execution model could exceed them by distributing their requests. A production-grade implementation would require Cloudflare KV or Durable Objects for distributed rate limit state.

## 5.5 Recommendations and Future Work

The following recommendations are offered both to guide future development of PathWise and to inform researchers and developers working on similar systems.

**Integration with Real Ghanaian Labour Market Data.** The most impactful single improvement to PathWise would be the integration of validated, regularly updated labour market data specific to Ghana and West Africa. Data sources including the Ghana Statistical Service Labour Force Reports, the Ghana Investment Promotion Centre sector analyses, the COTVET qualifications registry, and the Ghana Revenue Authority's salary survey data could provide the empirical grounding that the current curated knowledge base lacks. Integration would require building an ETL pipeline, mapping these sources' occupational taxonomies to PathWise's career vocabulary, and establishing a retraining schedule for the ML model.

**Enhanced Machine Learning Model.** The current scikit-learn ensemble model, while effective within the constraints of synthetic training data, could be substantially improved through several approaches. Semantic skill embeddings — representing skill strings as vectors in a shared semantic space learned from large text corpora — would allow the model to recognise that "Python" and "programming" are related concepts without requiring explicit feature engineering. Collaborative filtering components, trained on aggregate patterns in how users with different profiles engage with the platform's content, would introduce genuine data-driven personalisation signals beyond those encoded in the initial curated data. Sequence models capable of predicting career progression trajectories — not just current compatibility but likely future directions — would extend the platform's utility for professional users planning long-term development.

**Mentorship and Community Integration.** Career guidance is not purely an information problem — it is also a relational one. Connecting users with mentors who have navigated the careers they are exploring, or with peers who are on similar journeys, would add a dimension of social learning that no AI system, however sophisticated, can fully replicate. A structured mentorship matching feature, connecting platform users with verified mentors based on career interest alignment and geographic proximity, would significantly enhance the platform's value proposition.

**Mobile Application Development.** The current platform is a web application optimised for desktop and tablet use. A native mobile application — particularly for iOS and Android — would extend access to users whose primary computing device is a smartphone, a demographic that is disproportionately represented among the younger users who are most likely to benefit from career guidance. The platform's API-first architecture, where the Next.js frontend is cleanly separated from the backend API routes, would facilitate mobile development by allowing the mobile app to consume the same API endpoints as the web client.

**Analytics Dashboard for Self-Reflection.** Adding a personal analytics dashboard — showing the user how their interest profile has evolved over time, which careers they have explored, how their skill gap has closed for target careers, and how their roadmap progress compares to estimated timelines — would support the self-reflective dimension of career development that constructivist career theories identify as important. This feature would also provide valuable aggregate (anonymised) data for improving the platform's recommendation algorithms.

**Expanded Career Coverage and Multi-Language Support.** The current coverage of ninety-six careers, while broad, does not encompass all professionally significant occupations. Expanding to two hundred or more careers, with particular attention to emerging roles in artificial intelligence, climate technology, and the platform economy, would improve the platform's relevance for users with interests in rapidly evolving fields. Multi-language support would extend the platform's reach to non-anglophone users and markets, requiring both UI translation and the development of regionally specific career knowledge bases that reflect local qualification systems, salary norms, and employment structures.

## 5.6 Conclusion

PathWise was conceived as an answer to a specific and well-documented failure in the career guidance technology landscape: the failure to provide genuinely personalised, interest-first, pathway-inclusive, and continuously available guidance to individuals at every stage of their career journey. The project has demonstrated that this failure can be addressed through a combination of machine learning, generative artificial intelligence, and thoughtful interaction design — and that these techniques can be integrated into a production-grade, globally accessible platform within the scope of an undergraduate final year project.

The platform's interest-first onboarding, which translates activity language into career vocabulary before presenting career choices; its ML recommendation engine, which computes multi-dimensional compatibility scores rather than applying fixed rules; its grounded AI advisor, which grounds every response in verified platform data and adapts to the user's experience level; and its alternative pathways framework, which surfaces non-traditional routes with equal prominence — together represent a coherent and evidence-based response to the structural failures of existing systems.

The limitations acknowledged throughout this report — the static knowledge base, the synthetic training data, the distributed rate limiting gap — are real and should not be minimised. But they are limitations of scope and resource, not of architecture. The system is designed to accommodate their resolution: the ML service is independently deployable and the training pipeline replaceable; the knowledge base is stored as structured TypeScript objects that can be replaced with database-backed records; the rate limiter interface is abstracted behind a function that can be swapped for a distributed implementation. PathWise is, in this sense, not merely a completed project but a starting point.

The most enduring contribution of this project may be its demonstration that career guidance need not remain the domain of expensive professional advisors or generic digital tools. The combination of ML-based personalisation and grounded AI advisory, deployed on edge infrastructure and accessible without cost, represents a model for democratising access to high-quality career guidance — making the kind of thoughtful, personalised, contextually aware support that was once available only to the privileged few accessible to anyone with a browser and a question about where their life might take them.

---

## References

Anthropic. (2023). *Claude: A large language model for safe and beneficial AI*. Anthropic. https://www.anthropic.com

Bureau of Labor Statistics. (2024). *Occupational outlook handbook*. United States Department of Labor. https://www.bls.gov/ooh/

COTVET. (2023). *Council for Technical and Vocational Education and Training — Ghana: Accredited programmes register*. Government of Ghana.

Ghana Education Service. (2023). *Senior High School programme guidelines*. Ghana Education Service.

Ghana Statistical Service. (2023). *Ghana Labour Force Report 2023*. Ghana Statistical Service.

Cloudflare. (2024). *Cloudflare Workers documentation*. Cloudflare Inc. https://developers.cloudflare.com/workers/

Decorte, P., Demeester, T., & Develder, C. (2021). Career-level job recommendation using transformer-based semantic matching. *Proceedings of the AAAI Workshop on Knowledge Discovery from Unstructured Data in Financial Services*. AAAI.

Google. (2024). *Firebase authentication documentation*. Google LLC. https://firebase.google.com/docs/auth

Holland, J. L. (1959). A theory of vocational choice. *Journal of Counseling Psychology, 6*(1), 35–45. https://doi.org/10.1037/h0040767

Holland, J. L. (1973). *Making vocational choices: A theory of careers*. Prentice-Hall.

Kasneci, E., Sessler, K., Küchemann, S., Bannert, M., Dementieva, D., Fischer, F., Gasser, U., Groh, G., Günnemann, S., Hüllermeier, E., Krusche, S., Kutyniok, G., Michaeli, T., Nerdel, C., Pfeffer, J., Poquet, O., Sailer, M., Schmidt, A., Seidel, T., ... Kasneci, G. (2023). ChatGPT for good? On opportunities and challenges of large language models for education. *Learning and Individual Differences, 103*, Article 102274. https://doi.org/10.1016/j.lindif.2023.102274

Katz, M. R. (1975). *SIGI: A computer-based system of interactive guidance and information*. Educational Testing Service.

Kenthapadi, K., Le, B., & Venkataraman, G. (2017). Personalized job recommendation system at LinkedIn: Practical challenges and lessons learned. *Proceedings of the 11th ACM Conference on Recommender Systems* (pp. 346–347). ACM. https://doi.org/10.1145/3109859.3109921

Lent, R. W., Brown, S. D., & Hackett, G. (1994). Toward a unifying social cognitive theory of career and academic interest, choice, and performance. *Journal of Vocational Behavior, 45*(1), 79–122. https://doi.org/10.1006/jvbe.1994.1027

Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W., Rocktäschel, T., Riedel, S., & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. *Advances in Neural Information Processing Systems, 33*, 9459–9474.

Nauta, M. M. (2010). The development, evolution, and status of Holland's theory of vocational personalities: Reflections and future directions for counseling psychology. *Journal of Counseling Psychology, 57*(1), 11–22. https://doi.org/10.1037/a0018213

OpenAI. (2023). *GPT-4 technical report*. arXiv preprint arXiv:2303.08774. https://arxiv.org/abs/2303.08774

Parsons, F. (1909). *Choosing a vocation*. Houghton Mifflin.

Pedregosa, F., Varoquaux, G., Gramfort, A., Michel, V., Thirion, B., Grisel, O., Blondel, M., Prettenhofer, P., Weiss, R., Dubourg, V., Vanderplas, J., Passos, A., Cournapeau, D., Brucher, M., Perrot, M., & Duchesnay, E. (2011). Scikit-learn: Machine learning in Python. *Journal of Machine Learning Research, 12*, 2825–2830.

Ricci, F., Rokach, L., & Shapira, B. (2011). Introduction to recommender systems handbook. In F. Ricci, L. Rokach, B. Shapira, & P. B. Kantor (Eds.), *Recommender systems handbook* (pp. 1–35). Springer. https://doi.org/10.1007/978-0-387-85820-3_1

Rounds, J., & Su, R. (2014). The nature and power of interests. *Current Directions in Psychological Science, 23*(2), 98–103. https://doi.org/10.1177/0963721414522812

Savickas, M. L. (2005). The theory and practice of career construction. In S. D. Brown & R. W. Lent (Eds.), *Career development and counseling: Putting theory and research to work* (pp. 42–70). John Wiley & Sons.

Shalaby, W., AlAila, B., Korayem, M., Pournajaf, L., AlJadda, K., Quinn, S., & Ozturk, M. P. (2017). Help me find a job: A graph-based approach for job recommendation at scale. *Proceedings of the 2017 IEEE International Conference on Big Data* (pp. 1544–1553). IEEE. https://doi.org/10.1109/BigData.2017.8258091

Shridhar, K., Sinha, A., & Kakarla, H. (2023). Automatic feedback generation for short answer questions using GPT-3. *Proceedings of the 16th International Conference on Educational Data Mining*. EDM.

Super, D. E. (1953). A theory of vocational development. *American Psychologist, 8*(5), 185–190. https://doi.org/10.1037/h0056046

Super, D. E. (1980). A life-span, life-space approach to career development. *Journal of Vocational Behavior, 16*(3), 282–298. https://doi.org/10.1016/0001-8791(80)90056-1

Vercel. (2024). *Next.js documentation: App router*. Vercel Inc. https://nextjs.org/docs/app

---

## Appendices

### Appendix A: System Configuration Reference

The following table documents all environment variables required for a complete PathWise deployment.

**Table A.1: Complete Environment Variable Reference**

| Variable | Storage | Purpose |
|---|---|---|
| NEXT_PUBLIC_FIREBASE_API_KEY | Cloudflare secret | Firebase Client SDK configuration |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | Cloudflare secret | Firebase Client SDK configuration |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | Cloudflare env var | Firebase Client SDK configuration |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | Cloudflare secret | Firebase Client SDK configuration |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | Cloudflare secret | Firebase Client SDK configuration |
| NEXT_PUBLIC_FIREBASE_APP_ID | Cloudflare secret | Firebase Client SDK configuration |
| FIREBASE_PROJECT_ID | Cloudflare env var | Firebase Admin SDK (server-side) |
| FIREBASE_CLIENT_EMAIL | Cloudflare secret | Firebase Admin SDK (server-side) |
| FIREBASE_PRIVATE_KEY | Cloudflare secret | Firebase Admin SDK (server-side) |
| AIRTABLE_API_KEY | Cloudflare secret | Airtable REST API authentication |
| AIRTABLE_BASE_ID | Cloudflare env var | Airtable base identifier |
| ANTHROPIC_API_KEY | Cloudflare secret | Claude API authentication |
| ML_API_URL | Cloudflare env var | Python scikit-learn API base URL |
| RESEND_API_KEY | Cloudflare secret | Resend transactional email API |
| RESEND_FROM | Cloudflare env var | Email sender address |
| JWT_SECRET | Cloudflare secret | Session cookie signing key |

### Appendix B: Career Sectors and Categories

PathWise organises its ninety-six career entries across twenty-eight category values, which are dynamically grouped into ten sector labels for the career library interface.

| Sector | Categories |
|---|---|
| Computing & Technology | software, security, infrastructure |
| Data & AI | data, ai |
| Engineering | engineering |
| Health Sciences | healthcare, science, sports |
| Business & Finance | management, business, finance, logistics, hospitality, real-estate |
| Arts, Design & Media | design, creative, media |
| Legal & Compliance | legal, law |
| Education & Social | education, social, nonprofit, government |
| Trades & Vocational | construction, trades |
| Environment & Agriculture | agriculture, environment |

### Appendix C: Onboarding Step Validation Rules

| Step | Minimum Requirement | Field(s) Validated |
|---|---|---|
| Step 1 — Your Stage | Name non-empty AND education stage selected | name, education_stage |
| Step 2 — Work Type | At least 1 work preference selected | work_preferences |
| Step 3 — Interests | At least 1 interest added | interests |
| Step 4 — Skills | At least 1 skill added | skills |
| Step 5 — Preferences | No minimum (all have defaults) | preferred_work_style, learning_mode, availability |
| Step 6 — Goals | At least 1 industry selected | industries_of_interest |

### Appendix D: AI Intent Detection Pattern Reference

The following documents the regex pattern groups used by the intent detection module to classify user chat messages.

| Intent | Sample Triggering Patterns |
|---|---|
| getTopCareerMatches | "what career suits me", "which job should I do", "career options for me", "what should I become" |
| getCareerDetails | "tell me about [career]", "what does a [career] do", "salary for [career]", "describe [career]" |
| getRoadmap | "how do I become a [career]", "roadmap for [career]", "steps to become", "get started in [career]" |
| getSkillGapAnalysis | "skill gap for [career]", "what am I missing for [career]", "how ready am I", "am I qualified for" |
| compareCareers | "[career] vs [career]", "compare [career] and [career]", "which is better for me" |
| explainRecommendation | "why was [career] recommended", "explain my match score", "why do I match [career]" |

---

*End of PathWise Final Year Project Documentation*

*Word count: approximately 22,000 words across five chapters, abstract, and appendices.*
