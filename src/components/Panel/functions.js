/*export const panelFunctions = {
	getMenu: () => {
		const menu = [
			{
				id: "dashboard",
				content: "Dashboard",
				title: "Dashboard",
				accessibilityLabel: "Dashboard",
				link: "/panel/dashboard",
				redirectURL: "/panel/dashboard",
				panelID: "dashboard",
                children:[]
			},

			{
				id: "import",
				content: "Import/Upload",
				title: "Import/Upload",
				accessibilityLabel: "Import",
				link: "/panel/import",
				redirectURL: "/panel/import",
				panelID: "import",
                children:[]
			},

			{
                children:[{

                    id: "profiling",
                    content: "Profiling",
                    title: "Profiling",
                    accessibilityLabel: "Profiling",
                    link: "/panel/profiling",
                    redirectURL: "/panel/profiling",
                    panelID: "profiling"
                }],
				id: "products",
				content: "Products",
				title: "Products",
				accessibilityLabel: "Products",
				link: "/panel/products",
				redirectURL: "/panel/products",
				panelID: "products",

			},

            {
                id: "fbaorders",
                content: "FBA",
                title: "FBA",
                accessibilityLabel: "fbaOrders",
                link: "/panel/fbaOrders",
                redirectURL: "/panel/fbaOrders",
                panelID: "fbaOrders",
                children:[]
            },
			{
				id: "configuration",
				content: "Settings",
				title: "Settings",
				accessibilityLabel: "Configuration",
				link: "/panel/configuration",
				redirectURL: "/panel/configuration",
				panelID: "configuration",
                children:[
                    {
                        id: "accounts",
                        content: "Accounts",
                        title: "Accounts",
                        accessibilityLabel: "Accounts",
                        link: "/panel/accounts",
                        redirectURL: "/panel/accounts",
                        panelID: "accounts",
                    },
				]
			},
			{
				id: "plans",
				content: "Plans",
				title: "Plans",
				accessibilityLabel: "Plans",
				link: "/panel/plans",
				redirectURL: "/panel/plans",
				panelID: "plans",
                children:[]
			},
			{
				id: "queuedtasks",
				content: "Activities",
				title: "Activities",
				accessibilityLabel: "Activities",
				link: "/panel/queuedtasks",
				redirectURL: "/panel/queuedtasks",
				panelID: "queuedtasks",
                children:[]
			},
			{
				id: "help",
				content: "Help",
				title: "Help",
				accessibilityLabel: "HELP",
				link: "/panel/help",
				redirectURL: "/panel/help",
				panelID: "help",
                children:[]
			}
		];
		return menu;
	}
};*/

export const panelFunctions = {
    getMenu: () => {
        const menu = [
            {
                id: "dashboard",
                content: "Dashboard",
                accessibilityLabel: "Dashboard",
                link: "/panel/dashboard",
                panelID: "dashboard"
            },
            {
                id: "accounts",
                content: "Accounts",
                accessibilityLabel: "Accounts",
                link: "/panel/accounts",
                panelID: "accounts"
            },
            {
                id: "import",
                content: "Import/Upload",
                accessibilityLabel: "Import",
                link: "/panel/import",
                panelID: "import"
            },
            {
                id: "profiling",
                content: "Profiling",
                accessibilityLabel: "Profiling",
                link: "/panel/profiling",
                panelID: "profiling"
            },
            {
                id: "products",
                content: "Products",
                accessibilityLabel: "Products",
                link: "/panel/products",
                panelID: "products",
            },
            {
                id: "fbaorders",
                content: "FBA",
                accessibilityLabel: "fbaOrders",
                link: "/panel/fbaOrders",
                panelID: "fbaOrders"
            },{
                id: "aliexpressorders",
                content: "Aliexpress",
                accessibilityLabel: "aliexpressOrders",
                link: "/panel/aliexpressOrders",
                panelID: "aliexpressOrders"
            },
            {
                id: "configuration",
                content: "Settings",
                accessibilityLabel: "Configuration",
                link: "/panel/configuration",
                panelID: "configuration"
            },
            {
                id: "plans",
                content: "Plans",
                accessibilityLabel: "Plans",
                link: "/panel/plans",
                panelID: "plans"
            },
            {
                id: "queuedtasks",
                content: "Activities",
                accessibilityLabel: "Activities",
                link: "/panel/queuedtasks",
                panelID: "queuedtasks"
            },
            {
                id: "help",
                content: "Help",
                accessibilityLabel: "HELP",
                link: "/panel/help",
                panelID: "help"
            }
        ];
        return menu;
    }
};
