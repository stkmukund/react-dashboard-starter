import { BRAND_NAME_MAP } from "./utils";

export interface FormattedLoanExport {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    refcode: string;
    brand: string;
    loan_amount: string | number;
    date: string;
    status: string;
}

export function formatLoanRecordForExport(
    item: object,
    index = 0,
    fallbackBrand = ""
): FormattedLoanExport {
    const r = item as Record<string, unknown>;
    let payload: Record<string, unknown> = (r.payload as Record<string, unknown>) || {};
    if (typeof payload === "string") {
        try {
            payload = JSON.parse(payload);
        } catch {
            payload = {};
        }
    }

    // Names
    const rawName = String(payload.name || payload.fullName || r.name || r.fullName || "").trim();
    let firstName = String(
        payload.first_name ||
        payload.firstName ||
        payload.fname ||
        r.first_name ||
        r.firstName ||
        r.fname ||
        ""
    ).trim();
    let lastName = String(
        payload.last_name ||
        payload.lastName ||
        payload.lname ||
        r.last_name ||
        r.lastName ||
        r.lname ||
        ""
    ).trim();

    if (!firstName && rawName) {
        const parts = rawName.split(" ");
        firstName = parts[0] || "Applicant";
        lastName = parts.slice(1).join(" ") || "";
    }
    if (!firstName) firstName = "Applicant";

    // Contact
    const email = String(payload.email || payload.emailAddress || r.email || r.emailAddress || "");
    const phone = String(
        payload.phone ||
        payload.phoneMobile ||
        payload.cell ||
        payload.mobile ||
        payload.telephone ||
        r.phone ||
        r.phoneMobile ||
        r.cell ||
        r.mobile ||
        ""
    );

    // Address
    const address = String(
        payload.address ||
        payload.street ||
        payload.street_address ||
        payload.address1 ||
        r.address ||
        r.street ||
        r.street_address ||
        r.address1 ||
        ""
    );
    const city = String(payload.city || r.city || "");
    const state = String(payload.state || payload.state_code || r.state || r.state_code || "");
    const zipcode = String(
        payload.zipcode ||
        payload.zip ||
        payload.postal_code ||
        payload.postalCode ||
        r.zipcode ||
        r.zip ||
        r.postal_code ||
        ""
    );

    // Refcode & ID
    const id = String(r.id || r.lead_id || payload.id || payload.lead_id || `REC-${1000 + index}`);
    const refcode = String(
        payload.refcode ||
        payload.ref_code ||
        payload.reference_code ||
        r.refcode ||
        r.ref_code ||
        (r.lead_id ? `REF${r.lead_id}` : (r.id ? `REF${r.id}` : `REC-${1000 + index}`))
    );

    // Brand
    const rawBrand = String(
        r.brand ||
        r.site_name ||
        payload.brand ||
        payload.site_name ||
        payload.alt_source ||
        payload.leadOrigin ||
        fallbackBrand ||
        ""
    );
    const brand = (rawBrand && BRAND_NAME_MAP[rawBrand.toLowerCase()]) || rawBrand;

    // Loan amount
    const rawLoanAmount =
        payload.loan_amount ??
        payload.loanAmount ??
        payload.requestedAmount ??
        payload.requested_amount ??
        payload.clientEstimatedDebt ??
        payload.amount ??
        r.loan_amount ??
        r.loanAmount ??
        r.requestedAmount ??
        r.amount ??
        "";
    const loanAmount = rawLoanAmount !== "" && rawLoanAmount !== undefined ? String(rawLoanAmount) : "";

    // Date
    const rawDate = r.created_at || r.updated_at || r.date || payload.created_at || payload.date || "";
    const date = String(rawDate).trim();

    // Status
    const status = String(payload.status || r.status || "APPROVED").toUpperCase();

    return {
        id,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        city,
        state,
        zipcode,
        refcode,
        brand,
        loan_amount: loanAmount,
        date,
        status,
    };
}

export function downloadCsv(data: FormattedLoanExport[], filename: string): boolean {
    if (!data || data.length === 0) return false;

    const headers = [
        "ID",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Address",
        "City",
        "State",
        "Zipcode",
        "Refcode",
        "Brand",
        "Loan Amount",
        "Date",
        "Status",
    ];

    const csvRows: string[] = [
        headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
    ];

    data.forEach((item) => {
        const row = [
            item.id,
            item.first_name,
            item.last_name,
            item.email,
            item.phone,
            item.address,
            item.city,
            item.state,
            item.zipcode,
            item.refcode,
            item.brand,
            item.loan_amount,
            item.date,
            item.status,
        ];
        csvRows.push(
            row
                .map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`)
                .join(",")
        );
    });

    const csvContent = "\uFEFF" + csvRows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
}
