# KPMG Standard Glossary Terms

## Core Rules

- Existing document glossaries: If the document contains a glossary section, use it as the primary source. Extract those terms first, then scan the rest of the document for additional terms and merge/deduplicate into one glossary.
- Evidence & inclusion: Always include abbreviations and capitalized defined terms that appear in the document, even if they are not explicitly defined. When a definition is provided (e.g., “Net Working Capital (NWC)” or “NWC (Net Working Capital)”), use it; when the abbreviation appears alone (e.g., “NWC”), look to this file and document context to supply a reasonable definition. Entries in this file alone are not enough to add a term that never appears in the document.
- Multiple definitions: When a term has several possible meanings, choose the definition that matches the document’s industry and context. If it remains ambiguous after checking the document and this file, include it with `[?]` rather than guessing. You can also verify definitions as needed with web_search.
- Company vs Target: Map “Company” or “Target” to the detected client/target name. If both appear with distinct meanings (for example, buy‑side client vs sell‑side target), keep separate entries for each with their specific definitions. If they have the same meaning, combine them into one row using the slash format (e.g. `Target / Genfoot`). When the document uses a short label and a full legal name (e.g., “The Company” vs “Moregidge Inc.”), prefer the clean slash form with the full name (`Company / Moregidge Inc.`) as the glossary Term.

## Excluded Terms

Use this table to decide which classes of terms to exclude by default and when to override that exclusion based on document evidence.

| Category                          | Default treatment                                                                                          | Include when…                                                                                                  |
|-----------------------------------|------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| Brand names & product / SKU codes | Exclude by default to avoid noise if they only appear in this file or are mentioned once without context. | The document **defines them, uses them repeatedly, or clearly depends on them** for understanding the content. |
| Short abbreviations (1–2 letters) | Exclude stray single letters, list markers, and very common business abbreviations that are general knowledge (e.g., IT, HR, AP, AR, US). | Include only when the abbreviation is not generic "common knowledge" (e.g., deal-specific or domain-specific) or when the user explicitly asks for all abbreviations to be listed. |
| Technical jargon                  | Exclude generic industry prose terms that are not treated as special concepts.                             | They function as defined terms or abbreviations (e.g., "Enterprise Resource Planning (ERP)" → ERP in the text). |
| Proper nouns (beyond Company/Target) | Exclude one‑off people names and minor vendors.                                                           | They are key proper nouns referenced frequently (e.g., regulators, major vendors, named programs or platforms). |
| Financial adjustments             | Exclude generic adjustment terms: "Management adjustments", "Definitional adjustments", "Pro forma adjustments", and variations of "pro forma" when used descriptively. | The document uses them as specifically defined metrics or capitalized terms with unique meanings beyond their standard usage. Note: The abbreviation "PF" (Pro forma) may still be included when used as a standalone acronym. |

## Standard Terms

Use this table as the reference set of KPMG standard terms. When a term from the document appears here:

- Treat the listed definition as the default, unless the document clearly defines the term differently.
- Apply the Core Rules and Excluded Terms guidance to decide whether to include or exclude it from the final glossary.
- Prefer the document’s own definition over this table if there is any conflict.

| Term   | Definition                                                               |
| ------ | ------------------------------------------------------------------------ |
| AASB   | Auditing and Assurance Standards Board                                   |
| ABCP   | Asset-backed commercial paper                                            |
| ACB    | Adjusted cost base                                                       |
| ACI    | Automated Clearing House                                                 |
| ACQ    | Annual contract quantity                                                 |  
| ADP    | Automatic Data Processing                                                |
| AFCN   | Allowances for credit notes                                              |
| AFDA   | Allowance for doubtful accounts                                          |
| AFS    | Audited financial statements                                             |
| AGM    | Annual general meeting                                                   |
| AICPA  | American Institute of Certified Public Accountants                       |
| AML    | Anti money laundering                                                    |
| AOC    | Acquisition of control                                                   |
| AOCI   | Accumulated other comprehensive income                                   |
| AOV    | Average Order Value                                                      |
| AP     | Accounts payable                                                         |
| API    | Application Programming Interface                                        |
| APQC   | American Productivity & Quality Center                                   |
| AR     | Accounts receivable                                                      |
| ARPA   | Average revenue per user                                                 |
| ARR    | Annual recurring revenue                                                 |
| ASP    | Average selling price                                                    |
| ASPE   | Accounting Standards for Private Enterprises                             |
| ATM    | Automated Teller Machine                                                 |
| AUA    | Assets under administration                                              |
| AUAE   | AUA Equivalent                                                           |
| AUD    | Australian dollar                                                        |
| AUM    | Assets under management                                                  |
| BC     | British Columbia                                                         |
| BCC    | Best-cost-countries                                                      |
| BDM    | Business Development Managers                                            |
| BGN    | Bulgarian Lev                                                            |
| BI     | Business Intelligence                                                    |
| BIC    | Business Integrity Commission                                            |
| BPO    | Business Process Outsourcing                                             |
| BS     | Balance sheet                                                            |
| BU     | Business Unit                                                            |
| BV     | Book value                                                               |
| CAC    | Customer acquisition cost                                                |
| CAD    | Canadian dollar                                                          |
| CAF    | Card Authorization Fee                                                   |
| CAGR   | Compound annual growth rate                                              |
| CAPEX  | Capital expenditure                                                      |
| CCA    | Capital cost allowance                                                   |
| CCC    | Cash conversion cycle                                                    |
| CCM    | Customer Communication Management                                        |
| CCMOT  | Canadian Commercial Mortgage Origination Trust                           |
| CCO    | Chief Compliance Officer                                                 |
| CCPC   | Canadian Controlled Private Corporation                                  |
| CDD    | Commercial due diligence                                                 |
| CDIC   | Canada Deposit Insurance Corporation                                     |
| CDOR   | Canadian dollar offered rate                                             |
| CEO    | Chief Executive Officer                                                  |
| CEWS   | Canada emergency wage subsidy                                            |
| CF     | Cash flow                                                                |
| CFO    | Chief Financial Officer                                                  |
| CFS    | Cash Flow Statement                               |
| CGO    | Chief Growth Officer                                                     |
| CGU    | Cash generating unit                                                     |
| CHN    | People's Republic of China                                               |x
| CHP    | Combined heat and power                                                  |
| CID    | Center Information Display                                               |
| CIM    | Confidential Information Memorandum                                      |
| CIP    | Construction in Process                                                  |
| CJRS   | Coronavirus Job Retention Scheme                                         |x
| CMB    | Canada Mortgage Bond                                                     |
| CMBS   | Commercial mortgage-backed securities                                    |
| CMF    | CMLS Mortgage Fund                                                       |
| CMHC   | Canada Mortgage and Housing Corporation                                  |
| CMLS   | CMLS Financial Ltd                                                       |
| CMO    | Chief Marketing Officer                                                  |
| CN     | Credit notes                                                             |
| CNY    | Chinese Yuan                                                             |
| CODO   | Chief operations & development officer                                   |
| COGS   | Cost of goods sold                                                       |
| COO    | Chief Operating Officer                                                  |
| COPQ   | Cost of poor quality                                                     |
| CPA    | Chartered Professional Accountant                                        |
| CPAB   | Canadian Public Accountability Board                                     |
| CPC    | Contingent profit commission                                             |
| CPG    | Cents per gallon                                                         |
| CPP    | Concession revenues per patron                                           |
| CRM    | Customer Relationship Management                                         |
| CRO    | Chief Revenue Officer                                                    |
| CS     | Striata Communication Solutions Ltd                                      |
| CSI    | Computershare Investor                                                   |
| CSO    | Chief Strategy Officer                                                   |
| CUCA   | Credit Union Central Alberta                                             |
| CUCM   | Credit Union Central Manitoba                                            |
| CUCS   | Credit Union Central Saskatchewan                                        |
| CVO    | Chief Vision Officer                                                     |
| CY     | Current year                                                             |
| DA     | Data analytics                                                           |
| DB     | Defined benefit                                                          |
| DC     | Distribution center                                                      |
| DCC    | Dynamic Currency Conversion                                              |
| DD     | Debt Discount                                                            |
| DEFFF  | +I- +KF +KI LM1KK                                                        |
| DIO    | Days inventory outstanding                                               |
| DM     | Direct mail                                                              |
| DMA    | Deferred market adjustment                                               |
| DO     | Display operations                                                       |
| DPC    | Direct product cost                                                      |
| DPD    | Days past due                                                            |
| DPO    | Days payable outstanding                                                 |
| DPSP   | Deferred profit-sharing plans                                            |
| DSCR   | Debt Service Coverage Ratio                                              |
| DSO    | Days sales outstanding                                                   |
| DTA    | Deferred tax assets                                                      |
| DTL    | Deferred tax liability                                                   |
| EBIT   | Earnings before interest and taxes                                       |
| EBITDA | 93,402 324,415 355,963 289,589                                           |
| EBO    | Employee benefits obligation                                             |
| EBT    | Earnings before taxes                                                    |
| EC     | Equivalent Case                                                          |
| ECL    | Expected credit loss                                                     |
| EDI    | Electronic Data Interchange                                              |
| EFT    | Electronic Funds Transfers                                               |
| EHT    | Employer Health Tax                                                      |
| EI     | Employee Insurance                                                       |
| EMI    | Enterprise Management Incentive                                          |
| EMV    | Europay, Mastercard And Visa                                             |
| EOP    | End of production                                                        |
| EPOS   | Electronic Point of Sale                                                 |
| ERM    | Enterprise Risk Management                                               |
| ERP    | Enterprise Resource Planning                                             |
| ERS    | Employment-related securities                                            |
| ESPP   | Employee Share Purchase Plan                                             |
| EU     | European union                                                           |
| EUR    | Euro                                                                     |
| EVP    | Executive vice president                                                 |
| EY     | Ernst and Young                                                          |
| FAR    | Fixed Assets Register                                                    |
| FC     | Forecast                                                                 |
| FCF    | Free cash flow                                                           |
| FDD    | Financial due diligence                                                  |
| FF     | F XX: $x.x million) as well as sold receivables not yet paid by          |
| FG     | Finished goods                                                           |
| FHM    | From Host Maintenance                                                    |
| FI     | Financial Institution                                                    |
| FIN    | Finland                                                                  |
| FLC    | Fully loaded costs                                                       |
| FLI    | Forward looking information                                              |
| FM     | Fund Management                                                          |
| FMV    | Fair market value                                                        |
| FRS    | Financial reporting standard                                             |
| FS     | Financial statements                                                     |
| FTE    | Full time equivalents                                                    |
| FV     | Fair Value                                                               |
| FVOCI  | Fair Value through Other Comprehensive Income                            |
| FVTOCI | Fair value through other comprehensive income                            |
| FVTPL  | Fair value through profit or loss                                        |
| FX     | Foreign exchange                                                         |
| FY     | Financial year                                                           |
| FYE    | Financial year                                                           |
| GAAP   | Generally accepted accounting principles                                 |
| GBP    | Great Britain Pound                                                      |
| GDP    | Gross Domestic Product                                                   |
| GIC    | Guaranteed Investment Certificate                                        |
| GL     | General ledger                                                           |
| GM     | Gross margin                                                             |
| GP     | Gross profit                                                             |
| GRSP   | Group Registered Retirement Savings Plan                                 |
| GST    | Goods and services tax                                                   |
| GTM    | Go-to-market                                                             |
| HC     | Headcount                                                                |
| HCC    | High-cost-countries                                                      |
| HELOC  | Home equity line of credit                                               |
| HGB    | GAAP                                                                     |
| HKD    | Hong Kong dollar                                                         |
| HMRC   | Her Majesty’s Revenue and Customs                                        |
| HP     | Hewlett Packard                                                          |
| HQ     | Head quarter                                                             |
| HR     | Human resources                                                          |
| HRIS   | Human Resource Information System                                        |
| HST    | Harmonized sales tax                                                     |
| HTC    | Home Trust Company                                                       |
| IAS    | International Accounting Standards                                       |
| IASB   | International Accounting Standards Board                                 |
| IBAN   | International Bank Account Number                                        |
| IBR    | Incremental borrowing rate                                               |
| IC     | Issuance Cost                                                            |
| ICI    | Industrial, commercial & institutional                                   |
| ICO    | Intercompany                                                             |
| IDSW   | Internally developed software                                            |
| IE     | Industrial engineering                                                   |
| IFRS   | International Financial Reporting Standards                              |
| IMNA   | Inter-Member Network Agreement                                           |
| INA    | Information not available                                                |
| IND    | India                                                                    |
| INR    | Indian Rupee                                                             |
| IP     | Intellectual Property                                                    |
| IPO    | Initial public offering                                                  |
| IRE    | Republic of Ireland                                                      |
| IS     | Income statement                                                         |
| ISO    | International Organization For Standardization                           |
| IT     | Information Technology                                                   |
| ITA    | Income Tax Act                                                           |
| ITC    | Investment Tax Credits                                                   |
| JPN    | Japan                                                                    |
| JV     | Joint Venture                                                            |
| KOR    | South Korea                                                              |
| KPI    | Key performance indicator                                                |
| LATAM  | Latin America                                                            |
| LE     | Latest estimate (e.g., FY22LE = latest estimate for the financial        |
| LED    | Light-emitting diode                                                     |
| LFI    | Listed Financial Institution                                             |
| LFL    | Like for like                                                            |
| LFY    | Latest financial year                                                    |
| LGD    | Loss Given Default                                                       |
| LIBOR  | London Inter-bank Offered Rate                                           |
| LLC    | Limited liability corporation                                            |
| LLP    | Limited liability partnership                                            |
| LOB    | Line Of Business                                                         |
| LOI    | Letter of intent                                                         |
| LOS    | Loan origination system                                                  |
| LTD    | Long term debt                                                           |
| LTI    | Long term incentives                                                     |
| LTIP   | Long-Term Incentive Plan                                                 |
| LTM    | Last twelve months                                                       |
| LTV    | Loan to Value                                                            |
| LUA    | Loans under administration                                               |
| MA     | Management Accounts                                                      |
| MAX    | Maximum                                                                  |
| MB     | Manitoba                                                                 |
| MBS    | Mortgage backed securities                                               |
| MCR    | Management control report                                                |
| MES    | Manufacturing execution system                                           |
| MEX    | Mexico                                                                   |
| MGA    | Managing general agent                                                   |
| MIN    | Minimum                                                                  |
| MLR    | Minimum loan rate                                                        |
| MRR    | Monthly recurring revenue                                                |
| MSA    | Master Service Agreement                                                 |
| MTC    | Mark up on total cost                                                    |
| MTM    | Mark to Market                                                           |
| MXN    | Mexican Peso                                                             |
| NAV    | Net asset value                                                          |
| NBV    | Net book value                                                           |
| NCIB   | Normal Course Issuer Bid                                                 |
| NCV    | Net customer value                                                       |
| ND     | net debt                                                                 |
| NED    | Non-executive director                                                   |
| NI     | National Insurance                                                       |
| NIACS  | Net income available to common shareholders                              |
| NIM    | Net interest margin                                                      |
| NJ     | New Jersey                                                               |
| NOA    | Notice of assessment                                                     |
| NOL    | Non-Capital Losses                                                       |
| NPL    | Net non-performing loans                                                 |
| NPS    | Net product sales                                                        |
| NVSP   | Non-variable sales promotion                                             |
| NWC    | Net working capital                                                      |
| NYC    | New York City                                                            |
| OA     | On account                                                               |
| OC     | other considerations                                                     |
| OCI    | Other comprehensive income                                               |
| OD     | Overdraft                                                                |
| OEE    | Overall equipment effectiveness                                          |
| OEM    | Original equipment manufacturer                                          |
| OH     | Overheads                                                                |
| OIF    | Optional Issuer Fee                                                      |
| ON     | Ontario                                                                  |
| OPEX   | Operating Expenditure                                                    |
| OPW    | Off-payroll Working Rules                                                |
| OSC    | Ontario Securities Commission                                            |
| OTC    | Over the counter                                                         |
| OWC    | Other working capital                                                    |
| PA     | Pennsylvania                                                             |
| PAYE   | Pay As You Earn                                                          |
| PCAOB  | Public Company Accounting Oversight Board                                |
| PCL    | Provision for credit losses                                              |
| PF     | Pro forma                                                                |
| PILON  | Payment in lieu of notice                                                |
| PLM    | Product lifecycle management                                             |
| PM     | Project management                                                       |
| PNG    | Payment Network Gateway                                                  |
| PO     | Purchase Order                                                           |
| POS    | Point of sale                                                            |
| PPA    | Purchase price adjustment                                                |
| PPC    | Pay per click                                                            |
| PPE    | Property plant and equipment                                             |
| PPP    | Paycheck protection program                                              |
| PR     | Public Relations                                                         |
| PROD   | Production                                                               |
| PS     | Professional Services                                                    |
| PSA    | PAYE Settlement Agreement                                                |
| PSC    | Personal Service Company                                                 |
| PSCU   | Payment Systems for Credit Unions                                        |
| PSP    | Payment Service Provider                                                 |
| PST    | Provincial sales tax                                                     |
| PSU    | Performance share units                                                  |
| PUR    | Purchase                                                                 |
| PVD    | Provident fund                                                           |
| PWC    | PricewaterhouseCoopers                                                   |
| PY     | Prior year                                                               |
| QA     | Quality Assurance                                                        |
| QC     | Quality Control                                                          |
| QM     | Quality management                                                       |
| QST    | Quebec sales tax                                                         |
| RFP    | Request for proposal                                                     |
| RIBO   | Registered Insurance Brokers of Ontario                                  |
| RMBS   | Residential mortgage-backed security                                     |
| ROA    | Return on assets                                                         |
| ROAS   | Return on ad spend                                                       |
| ROE    | Return on equity                                                         |
| ROU    | right-of-use                                                             |
| ROW    | Rest of the World                                                        |
| RRSP   | Registered retirement savings plan                                       |
| RSU    | Restricted stock units                                                   |
| RWA    | Risk-weighted assets                                                     |
| SA     | South Africa                                                             |
| SBC    | Stock-based compensation                                                 |
| SDR    | Secure Document Repository                                               |
| SEO    | Search engine optimization                                               |
| SERP   | Supplementary executive retirement plan                                  |
| SIB    | Substantial Issuer Bid                                                   |
| SKU    | Stock Keeping Unit                                                       |
| SL     | Straight line                                                            |
| SLA    | Service level agreement                                                  |
| SMART  | Specific, Measurable, Achievable, Relevant, Time-bound                   |
| SME    | Small or medium sized enterprise                                         |
| SPA    | Sale Purchase Agreement                                                  |
| SRED   | Scientific and experimental development                                  |
| STIP   | Short term incentive plan                                                |
| STP    | Single touch payroll                                                     |
| SUAD   | Schedule of unadjusted audit differences                                 |
| SVP    | Senior vice president                                                    |
| TAC    | Total allowable catch                                                    |
| TAN    | Tax Adjustment Notes                                                     |
| TB     | Trial balance                                                            |
| TCP    | Taxable Canadian property                                                |
| TD     | Toronto Dominion                                                         |
| TDSR   | Total debt servicing ratio                                               |
| TMA    | Trade merchandise allowance                                              |
| TP     | Trade payables                                                           |
| TR     | Trade receivables                                                        |
| TSA    | Transition Services Agreement                                            |
| TSP    | Token Service Provider                                                   |
| TSX    | Toronto stock exchange                                                   |
| TTM    | Trailing twelve months                                                   |
| TUPE   | Transfer of Undertaking (Protection of Employment)                       |
| TWC    | Trade working capital                                                    |
| UQ     | Unquantifiable                                                           |
| US     | United states                                                            |
| USA    | The United States of America                                             |
| USD    | U.S. dollar                                                              |
| UVP    | Unique value proposition                                                 |
| UW     | Underwriting                                                             |
| VAR    | Value Added Reseller                                                     |
| VAT    | Value added tax                                                          |
| VDD    | Vendor due diligence                                                     |
| VDR    | Virtual Data Room                                                        |
| VP     | Vice president                                                           |
| VPC    | Volume, price, and cost                                                  |
| WAN    | Wide Area Network                                                        |
| WC     | working capital                                                          |
| WHT    | Withholding tax                                                          |
| WIP    | Work in progress                                                         |
| YE     | Year end                                                                 |
| YOY    | Year-over-year                                                           |
| YTD    | Year to date                                                             |
| YTG    | Year-to-go                                                               |
| ZAR    | South African Rand                                                       |
