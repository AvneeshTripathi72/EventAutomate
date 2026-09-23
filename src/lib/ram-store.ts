// RAM In-Memory Store for fallback and bypass mode
// Used when database calls fail, network is down, or for memory bypass mode

interface MemoryState {
  organizations: Map<string, any>;
  forms: Map<string, any>;
  sections: Map<string, any[]>;
  submissions: Map<string, any[]>;
  payments: Map<string, any[]>;
  members: Map<string, any[]>;
}

declare global {
  // eslint-disable-next-line no-var
  var __RAM_STORE__: MemoryState | undefined;
}

if (!globalThis.__RAM_STORE__) {
  globalThis.__RAM_STORE__ = {
    organizations: new Map([
      [
        "default-org",
        {
          id: "default-org-id",
          name: "Default Organization",
          slug: "default-org",
          created_at: new Date().toISOString(),
        },
      ],
    ]),
    forms: new Map([
      [
        "campus-esports-2026",
        {
          id: "campus-esports-2026",
          organization_id: "default-org-id",
          title: "Campus Esports Tournament 2026",
          slug: "campus-esports-2026",
          description: "Register your squad for BGMI & Valorant Inter-College Battle.",
          is_published: true,
          created_at: new Date().toISOString(),
          settings: { limit: 128, paymentEnabled: false },
          submissions_count: 34,
        },
      ],
      [
        "hackathon-2026",
        {
          id: "hackathon-2026",
          organization_id: "default-org-id",
          title: "National Tech Hackathon",
          slug: "national-tech-hackathon",
          description: "24-hour innovation marathon for students and tech developers.",
          is_published: true,
          created_at: new Date().toISOString(),
          settings: { limit: 250, paymentEnabled: true, fee: 199 },
          submissions_count: 86,
        },
      ],
    ]),
    sections: new Map(),
    submissions: new Map(),
    payments: new Map(),
    members: new Map(),
  };
}

export const ramStore = {
  getOrganizations: () => Array.from(globalThis.__RAM_STORE__!.organizations.values()),
  getOrganizationBySlug: (slug: string) => {
    for (const org of globalThis.__RAM_STORE__!.organizations.values()) {
      if (org.slug === slug) return org;
    }
    return {
      id: `ram-${slug}`,
      name: slug.toUpperCase(),
      slug: slug,
      created_at: new Date().toISOString(),
    };
  },
  saveOrganization: (org: any) => {
    globalThis.__RAM_STORE__!.organizations.set(org.id || org.slug, org);
    return org;
  },

  getFormById: (formId: string) => globalThis.__RAM_STORE__!.forms.get(formId),
  getForms: () => Array.from(globalThis.__RAM_STORE__!.forms.values()),
  saveForm: (formId: string, formData: any) => {
    globalThis.__RAM_STORE__!.forms.set(formId, formData);
    return formData;
  },

  saveSubmission: (formId: string, submission: any) => {
    const list = globalThis.__RAM_STORE__!.submissions.get(formId) || [];
    list.push(submission);
    globalThis.__RAM_STORE__!.submissions.set(formId, list);
    return submission;
  },
  getSubmissions: (formId: string) => globalThis.__RAM_STORE__!.submissions.get(formId) || [],

  recordPayment: (payment: any) => {
    const list = globalThis.__RAM_STORE__!.payments.get(payment.org_id || "default") || [];
    list.push(payment);
    globalThis.__RAM_STORE__!.payments.set(payment.org_id || "default", list);
    return payment;
  },
  getPayments: (orgSlug?: string) => {
    if (!orgSlug) {
      return Array.from(globalThis.__RAM_STORE__!.payments.values()).flat();
    }
    return globalThis.__RAM_STORE__!.payments.get(orgSlug) || [];
  },
};

export function createRamQueryBuilder(table: string) {
  const filters: Record<string, any> = {};

  const builder: any = {
    select(fields?: string, opts?: any) {
      return builder;
    },
    eq(col: string, val: any) {
      filters[col] = val;
      return builder;
    },
    in(col: string, vals: any[]) {
      return builder;
    },
    order() {
      return builder;
    },
    limit() {
      return builder;
    },
    single() {
      return builder.then((res: any) => ({
        data: Array.isArray(res.data) ? (res.data[0] || null) : res.data,
        error: null,
      }));
    },
    insert(val: any) {
      const inserted = Array.isArray(val) ? val.map((v, i) => ({ id: `ram-${Date.now()}-${i}`, ...v })) : { id: `ram-${Date.now()}`, ...val };
      return {
        select() {
          return {
            single: async () => ({ data: Array.isArray(inserted) ? inserted[0] : inserted, error: null }),
          };
        },
        then: (resolve: any) => resolve({ data: inserted, error: null }),
      };
    },
    update(val: any) {
      return {
        eq: () => ({
          select: () => ({
            single: async () => ({ data: val, error: null }),
          }),
        }),
        then: (resolve: any) => resolve({ data: val, error: null }),
      };
    },
    delete() {
      return {
        eq: () => ({
          select: () => async () => ({ data: [], error: null }),
        }),
        then: (resolve: any) => resolve({ data: [], error: null }),
      };
    },
    then(resolve: any) {
      let data: any[] = [];

      if (table === "organizations") {
        data = ramStore.getOrganizations();
        if (filters["slug"]) {
          data = data.filter((o: any) => o.slug === filters["slug"]);
        }
        if (filters["id"]) {
          data = data.filter((o: any) => o.id === filters["id"]);
        }
      } else if (table === "forms") {
        data = ramStore.getForms();
        if (filters["id"]) {
          data = data.filter((f: any) => f.id === filters["id"]);
        }
        if (filters["organization_id"]) {
          data = data.filter((f: any) => f.organization_id === filters["organization_id"]);
        }
      } else if (table === "members" || table === "organization_members") {
        data = [
          {
            id: "ram-member-1",
            organization_id: filters["organization_id"] || "default-org-id",
            role: "OWNER",
            sidebar_permissions: ["ALL"],
            organizations: {
              id: "default-org-id",
              name: "Default Organization",
              slug: "default-org",
            },
          },
        ];
      } else if (table === "payments") {
        data = ramStore.getPayments();
      } else if (table === "submissions") {
        data = [];
      }

      return Promise.resolve(resolve({ data, count: data.length, error: null }));
    },
  };

  return builder;
}
