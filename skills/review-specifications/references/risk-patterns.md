# Recurring project risks (use as a pattern library)

| Risk | Typical signal in the spec | Mitigation to propose |
|---|---|---|
| Third-party tool without API or import | "automatic entry into <tool>" with no mention of how | Ask the tool vendor in week 1; plan B import file; plan C through another connected tool; plan D assisted manual entry. The finding itself is a deliverable. |
| Two masters for the same data | New ERP stock module deployed next to an existing stock tool | Architecture rule: one master per data (stock, customers, prices); the other system reads. |
| Accesses not provided before kick-off | No checklist of accesses in the spec | Send an access checklist with the order; start conditioned on ~80 % of accesses; unused days carried over. |
| Business testers unavailable | Key user is also the busiest person | Short slots, real cases of the week, acceptance planned outside peak periods. |
| Scope creep | "and also…" requests during lots | Decision log; explicit V2 backlog; any addition = amendment or trade-off against an item of the lot. |
| Oral vs written gap | Dates or features promised in meetings | Written summary the same day after each meeting; dates only in documents. |
| Data quality | Unnormalised supplier/product names, spreadsheets as sources | Reference data v0 early; naming rules; import control with explicit rejects. |
| Small editor dependency | Critical tool made by a 2-person company | Written support contract, regular exports, no business logic locked in the tool. |
| Payroll / accounting cut-over | Switch planned mid-month or in a busy period | Parallel run on one cycle, cut-over in a calm month, accountant control. |
| Demo mistaken for commitment | Early prototype shown to management | Say "demo, not decision" at opening and closing; written minutes. |
| Personal / HR / health data | HR records, absences, medical certificates in scope | DPA before access; restricted access; EU hosting; check health-data hosting obligations. |
| Financing fragility | Large lot committed before any value delivered | Short phases payable separately; no commitment over 3 months without a paid milestone. |
