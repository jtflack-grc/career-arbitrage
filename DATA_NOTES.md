# Data notes — August 2026

The dataset is deliberately compact and approximate. It is good enough for preference exploration, not enrollment or financial planning.

## Wage anchors

Most national wage anchors use the U.S. Bureau of Labor Statistics May 2025 Occupational Employment and Wage Statistics release. Examples in the current dataset include:

- Diagnostic medical sonographers: $97,240 median annual wage.
- Nuclear medicine technologists: $105,160.
- MRI technologists: $96,120.
- Radiation therapists: $114,990.
- Respiratory therapists: $87,300.
- Registered nurses: $101,420.
- Nurse anesthetists: $248,320.
- Physician assistants: $141,280.
- Medical dosimetrists: $148,500.
- Information security analysts: $132,510.
- Software developers: $148,100.
- Electrical engineers: $125,100.
- Accountants/auditors: $94,750.
- Actuaries: $141,480.

Specialized NC examples:

- UNC Health CAA hiring range in 2026: $116.35–$132.41/hour.
- UNC Health perfusionist hiring range in 2026: $63.97–$91.95/hour.

## Tuition assumptions

The simulator uses rough total direct-education costs, not cost-of-attendance estimates. They are placeholders meant to make debt sensitivity visible.

- Community-college clinical paths: generally modeled around $12K–$26K total.
- Local bachelor’s paths: generally modeled around $28K–$32K total direct tuition/fees.
- CRNA path: modeled around $73K direct education using a low-cost ADN + RN-to-BSN + in-state public nurse-anesthesia route.
- CAA path: modeled around $165K direct education because Case Western’s 2026–27 MSA tuition is $25,820 per semester for six semesters ($154,920 before other costs), plus a low-cost undergraduate path.

## Wealth model caveats

The wealth race is not a financial plan. It assumes:

- 27% gross-income haircut for taxes/withholding.
- 7% annual investment return.
- 6.5% student-loan APR.
- User-selected savings rate.
- A small savings-rate increase while living with family.
- Simplified salary ramps toward a current median/target.

It omits housing, health insurance, scholarships, employer retirement match, inflation, income taxes by state, overtime, bonuses, unemployment, graduate stipends, loan-forgiveness programs and many other real variables.
