(function () {
    const subdomain = window.location.hostname.replace('.service-now.com', '');
    const excludedURLs = ['www', 'signon', 'sso', 'auth', 'angel', 'angeldemo', 'applibrary', 'partnerportal', 'partnermarketing', 'gld', 'clabs', 'developer', 'support', 'training', 'healthscan'];
    if (window.location.hostname.endsWith('service-now.com') && !excludedURLs.includes(subdomain)) {
        const currentOverlay = document.getElementById('sntk-modal-overlay');
        if (currentOverlay) {
            currentOverlay.remove();
            return;
        }
        const overlay = document.createElement('div');
        const modal = document.createElement('div');
        overlay.id = 'sntk-modal-overlay';

        const extendedSearchOptions = [
            {
                "title": "System Properties",
                "name": "sys_properties",
                "search_by": ["name"]
            },
            {
                "title": "Local Update Sets",
                "name": "sys_update_set",
                "search_by": ["name"]
            },
            {
                "title": "Retrieved Update Sets",
                "name": "sys_remote_update_set",
                "search_by": ["name"]
            },
            {
                "title": "Tables",
                "name": "sys_db_object",
                "search_by": ["name", "label"]
            },
            {
                "title": "Business Rules",
                "name": "sys_script",
                "search_by": ["name"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "Scheduled Jobs",
                "name": "sysauto",
                "search_by": ["name"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "Script Includes",
                "name": "sys_script_include",
                "search_by": ["name"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "Assignment Rules",
                "name": "sysrule_assignment",
                "search_by": ["name"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "Fix Scripts",
                "name": "sys_script_fix",
                "search_by": ["name"]
            },
            {
                "title": "Client Scripts",
                "name": "sys_script_client",
                "search_by": ["name"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "Catalog Client Scripts",
                "name": "catalog_script_client",
                "search_by": ["name"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "UI Policies",
                "name": "sys_ui_policy",
                "search_by": ["short_description"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "Catalog UI Policies",
                "name": "catalog_ui_policy",
                "search_by": ["short_description"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "UI Actions",
                "name": "sys_ui_action",
                "search_by": ["name", "action_name"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "UI Pages",
                "name": "sys_ui_page",
                "search_by": ["name"]
            },
            {
                "title": "Business Services",
                "name": "cmdb_ci_service_business",
                "search_by": ["name"]
            },
            {
                "title": "Service Offerings",
                "name": "service_offering",
                "search_by": ["name"]
            },
            {
                "title": "Catalog Items",
                "name": "sc_cat_item",
                "search_by": ["name"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "Record Producers",
                "name": "sc_cat_item_producer",
                "search_by": ["name"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "Order Guides",
                "name": "sc_cat_item_guide",
                "search_by": ["name"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "User Criteria",
                "name": "user_criteria",
                "search_by": ["name"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "Roles",
                "name": "sys_user_role",
                "search_by": ["name"]
            },
            {
                "title": "Groups",
                "name": "sys_user_group",
                "search_by": ["name"],
                "order_by": "^ORDERBYDESCactive"
            },
            {
                "title": "Users",
                "name": "sys_user",
                "search_by": ["name", "user_name", "email"],
                "order_by": "^ORDERBYDESCactive"
            }
        ];

        function getExtendedSearchTooltip() {
            const tooltip = extendedSearchOptions
                .map(option => `- ${option.title} (Search by ${option.search_by.join(', ')})`)
                .join('\n');
            return tooltip;
        }

        function getExtendedSearchLink(mode, table, query) {
            const option = extendedSearchOptions.find(option => option.name === table);
            if (option) {
                if (mode === 'RECORD') {
                    return `${table}.do?sysparm_query=${option.search_by.map(name => `${name}=${encodeURIComponent(query)}`).join('^OR')}${option.order_by ? option.order_by : ''}`;
                }
                if (mode === 'LIST') {
                    const queryParam = query === ''
                        ? '&sysparm_filter_only=true'
                        : `&sysparm_query=${option.search_by.map(name => `${name}LIKE${encodeURIComponent(query)}`).join('^OR')}${option.order_by ? option.order_by : ''}`;
                    return `${table}_list.do?sysparm_filter_pinned=true${queryParam}`;
                }
            }
            return null;
        }

        const shortcutLinks = [
            { label: 'Create new update set', path: '/sys_update_set.do' },
            { label: 'Background Script (sys.scripts.modern.do)', path: '/sys.scripts.modern.do' },
            { label: 'Cancel Transactions (cancel_my_transactions.do)', path: '/cancel_my_transactions.do' },

            { label: 'SYSTEM TRANSACTIONS', isHeader: true },
            { label: 'Active Transactions', path: '/v_transaction_list.do?sysparm_query=ORDERBYASCsys_created_on' },
            { label: 'Active Cluster Transactions', path: '/loading_transactions.do' },
            { label: 'Recent Slow Transactions', path: '/sys_transaction_pattern_list.do?sysparm_query=window_endISEMPTY^window_startISEMPTY^firstONLast 2 hours@javascript:gs.beginningOfLast2Hours()@javascript:gs.endOfLast2Hours()^ORDERBYDESCaverage' },
            { label: 'Recent Transaction Logs', path: '/syslog_transaction_list.do?sysparm_query=urlSTARTSWITH/^sql_count>0^response_time>=5000^sys_created_by!=guest^sys_created_onONLast 2 hours@javascript:gs.beginningOfLast2Hours()@javascript:gs.endOfLast2Hours()^ORDERBYDESCresponse_time' },
            { label: 'Recent Background Transactions', path: '/syslog_transaction_list.do?sysparm_query=urlSTARTSWITHJOB^response_time>=5000^sys_created_onONLast 2 hours@javascript:gs.beginningOfLast2Hours()@javascript:gs.endOfLast2Hours()^ORDERBYDESCresponse_time' },
            { label: 'Recent Client Transactions', path: '/syslog_transaction_list.do?sysparm_query=client_transaction=true^response_time>=5000^sys_created_onONLast 2 hours@javascript:gs.beginningOfLast2Hours()@javascript:gs.endOfLast2Hours()^ORDERBYDESCresponse_time' },
            { label: 'Slow Queries', path: '/sys_query_pattern_list.do?sysparm_query=window_endISEMPTY^window_startISEMPTY^average>=5000^sys_created_onONLast 7 days@javascript:gs.beginningOfLast7Days()@javascript:gs.endOfLast7Days()^ORDERBYDESCaverage' },
            { label: 'Slow Scripts', path: '/sys_script_pattern_list.do?sysparm_query=window_endISEMPTY^window_startISEMPTY^average>=5000^sys_created_onONLast 7 days@javascript:gs.beginningOfLast7Days()@javascript:gs.endOfLast7Days()^ORDERBYDESCaverage' },
            { label: 'Recent Logs', path: '/syslog_list.do?sysparm_query=sys_created_onONLast 2 hours@javascript:gs.beginningOfLast2Hours()@javascript:gs.endOfLast2Hours()^ORDERBYDESCsys_created_on' },

            { label: 'AUDIT LIST', isHeader: true },
            { label: 'Inactive Users with directly assigned roles', path: '/sys_user_has_role_list.do?sysparm_query=user.active=false^inherited=false^ORDERBYuser.name^ORDERBYrole.name^GROUPBYuser' },
            { label: 'Inactive Users with assigned groups', path: '/sys_user_grmember_list.do?sysparm_query=user.active=false^ORDERBYuser.name^ORDERBYgroup.name^GROUPBYuser' },
            { label: 'Dormant Users', path: '/sys_user_list.do?sysparm_query=active=true^last_login_timeNOTONLast 90 days@javascript:gs.beginningOfLast90Days()@javascript:gs.endOfLast90Days()^ORDERBYlast_login_time' },
            { label: 'Groups without members', path: '/sys_user_group_list.do?sysparm_query=RLQUERYsys_user_grmember.group,=0^ENDRLQUERY^ORDERBYname' },
            { label: 'Inactive Groups with assigned roles', path: '/sys_group_has_role_list.do?sysparm_query=group.active=false^ORDERBYgroup.name^ORDERBYrole.name^GROUPBYgroup' },
            { label: 'Inactive Groups with members', path: '/sys_user_grmember_list.do?sysparm_query=group.active=false^ORDERBYgroup.name^ORDERBYuser.name^GROUPBYgroup' },
            { label: 'Stuck Workflow contexts', path: '/wf_context_list.do?sysparm_query=state=faulted^ORDERBYstarted^GROUPBYworkflow_version' },
            { label: 'Aging Workflow contexts in progress', path: '/wf_context_list.do?sysparm_query=state=executing^startedNOTONLast 90 days@javascript:gs.beginningOfLast90Days()@javascript:gs.endOfLast90Days()^ORDERBYstarted^GROUPBYworkflow_version' },
            { label: 'Requested Cross scope privileges', path: '/sys_scope_privilege_list.do?sysparm_query=status=requested^ORDERBYsys_created_on^GROUPBYoperation' }
        ];

        modal.innerHTML = `
            <div style="background-color: #032D42; color: white; padding: 20px 30px 19px 30px; font-weight: 600; font-size: 17px; line-height: 1.2;">
                <a href="https://github.com/sn-toolkit/sn-toolkit-lite" target="_blank"
                    style="color: white; text-decoration: none; cursor: pointer;">
                    SN Toolkit Lite
                </a>
            </div>
            <div style="padding: 25px; background: #F5F5F5;">
                <div style="background-color: white; padding: 1px 10px; border-radius: 25px;">
                    <p style="font-size: 14px; font-weight: bold; margin: 1.5px;">
                        <span id="subdomain" style="cursor: pointer; color: #032D42;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'"
                            title="Switch environment">${subdomain}</span>
                        <span style="color: gray; font-style: italic;">.service-now.com</span>
                    </p>
                </div>
                <div style="margin-top: 15px; display: flex; gap: 10px; align-items: center;">
                    <input type="text" id="sntk-search-input" placeholder="Global Search" list="common-queries" style="flex: 1; padding: 10px 15px; border: 1px solid #ccc; border-radius: 25px; font-size: 12px; font-weight: bold; font-family: inherit; outline: none; color: #333;" />
                    <datalist id="common-queries"></datalist>
                    <button id="sntk-search-btn" title="Global Search\nPress Enter\n\n- Record numbers (e. g. INC0000001, CHG0000001)\n- Table processors (e. g. task.LIST, task.FILTER, task.DO, task.CONFIG)\n- Users (Search by email)\n- Dictionary Entries (Search by table.field)\n- Text search"
                        style="background-color: #032D42; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-size: 12px; font-weight: bold; font-family: inherit;">
                        SEARCH
                    </button>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span id="searchInputMsg" style="display: none; font-size: 10px; font-weight: bold; color: #dc3545; margin: 8px 0px 0px 15px;">Search query is empty</span>
                    <span id="extendedGlobalSearch" title="Extended Global Search\nPress Shift + Enter\n\n- Search ServiceNow Documentation\n- System Properties (Search by name)\n- Local Update Sets (Search by name)\n- Retrieved Update Sets (Search by name)\n- Tables (Search by name or label)\n- Business Rules (Search by name)\n- Scheduled Jobs (Search by name)\n- Script Includes (Search by name)\n- Assignment Rules (Search by name)\n- Client Scripts (Search by name)\n- UI Actions (Search by name or action_name)\n- Business Services (Search by name)\n- Service Offerings (Search by name)\n- Record Producers (Search by name)\n- Catalog Items (Search by name)\n- Groups (Search by name)\n- Users (Search by name, user_name, or email)"
                        style="font-size: 10px; font-weight: bold; color: #032D42; margin: 10px 15px 0px auto; cursor: pointer;">Global Search Options</span>
                </div>
                <div id="extendedGlobalSearchDiv" style="display: none; margin-top: 15px; max-height: 300px; overflow-y: auto; color: #032D42;">
                    <ul style="list-style: none; padding: 0; margin: 0; font-weight: bold; font-size: 12px; text-align: right;">
                        <li id="servicenow_search_engine" style="padding: 5px 10px; cursor: pointer;" title="Search the official ServiceNow documentation and community forums">Search ServiceNow Documentation</li>
                        ${extendedSearchOptions.map(item => `
                            <li style="padding: 5px 10px;">
                                <span id="search_${item.name}" title="Search ${item.name} by ${item.search_by.join(', ')}&#10;Opens the record directly" style="margin-right: 15px; cursor: pointer;">${item.title + ' ➚'}</span>
                                <span id="search_${item.name}_list" title="Search ${item.name} by ${item.search_by.join(', ')}&#10;Opens a filtered list" style="cursor: pointer;">Run filter ➚</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div id="shortcutsDiv" style="margin-top: 15px; max-height: 300px; overflow-y: auto; color: #032D42;">
                    <ul style="list-style: none; padding: 0; margin: 0; font-weight: bold; font-size: 12px;">
                        <li style="padding: 5px 10px"><a id="sntkToggleNavigationBtn" href="#" title="Toggle navigation bar / banner frame" style="color: #032D42; text-decoration: none;">Toggle navigation bar</a></li>
                        ${shortcutLinks.map(link => link.isHeader
            ? `<li style="padding: 5px 10px; margin-top: 15px; color: #777777">${link.label}</li>`
            : `<li style="padding: 5px 10px"><a href="${origin}${link.path}" style="color: #032D42; text-decoration: none;" target="_blank">${link.label + ' ➚'}</a></li>`
        ).join('')}
                    </ul>
                </div>
            </div>
        `;

        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)',
            fontFamily: '-apple-system, "Segoe UI", "Helvetica Neue", Arial, Verdana, sans-serif'
        });
        Object.assign(modal.style, {
            backgroundColor: 'white',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            borderRadius: '12.5px',
            maxWidth: '480px',
            width: '90%',
            padding: '0',
            overflow: 'hidden'
        });
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

        function getSelectedText() {
            let text = '';
            if (window.getSelection) {
                text = window.getSelection().toString();
            } else if (document.selection && document.selection.type !== 'Control') {
                text = document.selection.createRange().text;
            }
            return text;
        }

        const globalSearch = document.getElementById('sntk-search-input');
        globalSearch.value = getSelectedText();
        globalSearch.focus();

        const SYSID_REGEX = /^[0-9a-f]{32}$/i;
        const SUBDOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;
        const TABLE_REGEX = /^(?:[a-z_][a-z0-9_]*)(?:\.do|_list\.do)$/;
        const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const DICTIONARY_REGEX = /^[a-z0-9_]+\.[a-z0-9_]+$/i;

        document.getElementById('subdomain').onclick = () => {
            let result = prompt("Open same page in another instance:", subdomain);
            if (result) {
                result = result.trim().toLowerCase();
                if (SUBDOMAIN_REGEX.test(result)) {
                    if (result === subdomain) {
                        alert('Enter a different subdomain');
                    } else {
                        window.open(window.location.href.replace(window.location.hostname, result + '.service-now.com'), '_blank');
                    }
                } else {
                    alert('Invalid subdomain');
                }
            }
        };

        const commonTables = [
            'task',
            'incident',
            'change_request',
            'problem',
            'sc_request',
            'sc_req_item',
            'sc_task',
            'sysapproval_approver',
            'contract_sla',
            'task_sla',
            'sys_user',
            'sys_user_group',
            'sys_user_role',
            'sys_user_grmember',
            'sys_user_has_role',
            'sys_user_delegate',
            'sys_user_preference',
            'sys_user_session',
            'sys_update_set',
            'sys_update_xml',
            'sys_metadata',
            'sys_app',
            'sys_app_module',
            'sys_db_object',
            'sys_dictionary',
            'sys_script_include',
            'sys_script',
            'sysrule_assignment',
            'sys_properties',
            'sys_security_acl',
            'syslog',
            'syslog_transaction',
            'sys_status',
            'sys_cluster_state',
            'sys_cache_flush',
            'sysevent',
            'sys_import_set_run',
            'sys_import_set_row',
            'sys_export_set',
            'ecc_queue',
            'sys_rest_message_fn',
            'sys_api_stats',
            'sc_catalog',
            'sc_cat_item',
            'sc_cat_item_producer',
            'item_option_new',
            'question_answer',
            'cmdb_ci',
            'cmdb_ci_service',
            'service_offering',
            'cmdb_rel_ci'
        ];

        function getTableConfigURL(urlOrigin, table) {
            return `${urlOrigin}/personalize_all.do?sysparm_rules_table=${encodeURIComponent(table)}&sysparm_rules_label=${encodeURIComponent(table)}`;
        }

        function getTextSearchURL(urlOrigin, query) {
            return `${urlOrigin}/text_search_exact_match.do?sysparm_search=${encodeURIComponent(query)}`;
        }

        function setSearchInputMsg(message = '') {
            const searchInputMsg = document.getElementById('searchInputMsg');
            if (message == '') {
                searchInputMsg.style.display = 'none';
            } else {
                searchInputMsg.style.display = 'block';
            }
            searchInputMsg.textContent = message;
        }

        document.getElementById('sntk-search-btn').onclick = () => {
            const original = globalSearch.value.trim();
            const query = globalSearch.value.trim().toLowerCase();
            if (query == '') {
                setSearchInputMsg('Search query is empty');
            } else {
                let newURL = null;
                if (SYSID_REGEX.test(query)) {
                    setSearchInputMsg('Sys ID search is not available');
                } else if (EMAIL_REGEX.test(query)) {
                    newURL = `${window.location.origin}/sys_user.do?sysparm_query=email=${encodeURIComponent(query)}^ORuser_name=${encodeURIComponent(query)}`;
                } else if (TABLE_REGEX.test(query)) {
                    newURL = `${window.location.origin}/${query}`;
                } else if (commonTables.includes(query)) {
                    newURL = getTableConfigURL(window.location.origin, query);
                } else if (query.endsWith('.list')) {
                    let table = query.replace('.list', '');
                    if (TABLE_REGEX.test(`${table}_list.do`)) {
                        newURL = `${window.location.origin}/${table}_list.do`;
                    } else {
                        newURL = getTextSearchURL(window.location.origin, query);
                    }
                } else if (query.endsWith('.filter')) {
                    let table = query.replace('.filter', '');
                    if (TABLE_REGEX.test(`${table}_list.do`)) {
                        newURL = `${window.location.origin}/${table}_list.do?sysparm_filter_only=true&sysparm_filter_pinned=true`;
                    } else {
                        newURL = getTextSearchURL(window.location.origin, query);
                    }
                } else if (query.endsWith('.config')) {
                    let table = query.replace('.config', '');
                    if (TABLE_REGEX.test(`${table}_list.do`)) {
                        newURL = getTableConfigURL(window.location.origin, table);
                    } else {
                        newURL = getTextSearchURL(window.location.origin, query);
                    }
                } else if (DICTIONARY_REGEX.test(query)) {
                    let [table, field] = query.split('.');
                    newURL = `${window.location.origin}/sys_dictionary.do?sysparm_query=name=${encodeURIComponent(table)}^element=${encodeURIComponent(field)}`;
                } else {
                    newURL = getTextSearchURL(window.location.origin, original);
                }
                if (newURL) {
                    window.open(newURL, '_blank');
                }
            }
        };

        function toggleExtendedGlobalSearch() {
            const extendedGlobalSearchDiv = document.getElementById('extendedGlobalSearchDiv');
            const shortcutsDiv = document.getElementById('shortcutsDiv');
            if (extendedGlobalSearchDiv.style.display == 'none') {
                extendedGlobalSearchDiv.style.display = 'block';
                shortcutsDiv.style.display = 'none';
            } else {
                extendedGlobalSearchDiv.style.display = 'none';
                shortcutsDiv.style.display = 'block';
            }
        }

        document.getElementById('extendedGlobalSearch').onclick = () => {
            setSearchInputMsg();
            toggleExtendedGlobalSearch();
        };

        document.getElementById('servicenow_search_engine').onclick = () => {
            const query = globalSearch.value.trim();
            if (query == '') {
                setSearchInputMsg('Search query is empty');
            } else {
                window.open(`https://cse.google.com/cse?cx=e2f9fd84159ae4672&q=${encodeURIComponent(query)}&hl=en`, '_blank');
            }
        };

        extendedSearchOptions.forEach(item => {
            document.getElementById(`search_${item.name}`).onclick = () => {
                const query = globalSearch.value.trim();
                if (query == '') {
                    setSearchInputMsg('Search query is empty');
                } else {
                    window.open(`${window.location.origin}/${getExtendedSearchLink('RECORD', item.name, query)}`, '_blank');
                }
            }
            document.getElementById(`search_${item.name}_list`).onclick = () => {
                const query = globalSearch.value.trim();
                window.open(`${window.location.origin}/${getExtendedSearchLink('LIST', item.name, query)}`, '_blank');
            }
        });

        function loadCommonQueries(query = '') {
            const commonQueries = document.getElementById('common-queries');
            commonQueries.innerHTML = '';
            let suggestions = [];
            let filteredTables = commonTables;
            let exactMatch = filteredTables.find(item => { return item === query; });
            const suffixes = ['.LIST', '.FILTER', '.DO', '.CONFIG'];
            if (exactMatch) {
                for (const value of suffixes) {
                    suggestions.push(`${query}${value}`);
                    const option = document.createElement('option');
                    option.value = `${query}${value}`;
                    commonQueries.appendChild(option);
                }
            }
            filteredTables = filteredTables.filter(item => { return item.includes(query); });
            for (const value of filteredTables) {
                let table = `${value}.LIST`;
                if (!suggestions.includes(table)) {
                    suggestions.push(table);
                    const option = document.createElement('option');
                    option.value = table;
                    commonQueries.appendChild(option);
                }
                if (suggestions.length == 6) {
                    return false;
                }
            }
            if (suggestions.length < 6 && TABLE_REGEX.test(`${query}_list.do`) && !SYSID_REGEX.test(query)) {
                for (const value of suffixes) {
                    if (!suggestions.includes(`${query}${value}`)) {
                        suggestions.push(`${query}${value}`);
                        const option = document.createElement('option');
                        option.value = `${query}${value}`;
                        commonQueries.appendChild(option);
                        if (suggestions.length == 6) {
                            return false;
                        }
                    }
                }
            }
        }

        loadCommonQueries();

        function debounce(func, wait) {
            let timeout;
            const debounced = function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.apply(this, args);
                }, wait);
            };
            debounced.cancel = function () {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            };
            return debounced;
        }

        const debouncedLoadCommonQueries = debounce(loadCommonQueries, 100);
        globalSearch.oninput = (e) => {
            const query = e.target.value.trim();
            debouncedLoadCommonQueries(query);
            setSearchInputMsg();
        };

        globalSearch.onkeydown = (e) => {
            if (e.key === 'Enter') {
                if (e.shiftKey) {
                    toggleExtendedGlobalSearch();
                } else {
                    document.getElementById('sntk-search-btn').click();
                }
            }
        };

        document.getElementById('sntkToggleNavigationBtn').onclick = (e) => {
            e.preventDefault();
            let url = new URL(window.location.href);
            let targetPath = '';
            const CLASSIC_UI_STR = 'nav_to.do?uri=';
            const POLARIS_UI_STR = 'now/nav/ui/classic/params/target/';
            const navtoIndex = url.href.indexOf(CLASSIC_UI_STR);
            const polarisIndex = url.href.indexOf(POLARIS_UI_STR);

            if (navtoIndex > -1 || polarisIndex > -1) {
                if (navtoIndex > -1) {
                    targetPath = decodeURIComponent(url.searchParams.get('uri') || '');
                } else {
                    const pathSuffix = url.pathname.split(POLARIS_UI_STR)[1];
                    targetPath = decodeURIComponent(pathSuffix + url.search);
                }
                if (targetPath) {
                    window.location.href = url.origin + (targetPath.startsWith('/') ? '' : '/') + targetPath;
                }
            } else {
                const pathName = url.pathname.replace(/^\//, '');
                const fullPath = pathName + url.search;
                const newURL = `${url.origin}/nav_to.do?uri=${encodeURIComponent(fullPath)}`;
                window.location.href = newURL;
            }
        };

        const elements = document.querySelectorAll('#sntk-modal-overlay *');
        elements.forEach((element) => {
            const isTextInput = element.tagName === 'INPUT' && element.type === 'text';
            const isTextArea = element.tagName === 'TEXTAREA';
            if (!isTextInput && !isTextArea) {
                element.style.webkitUserSelect = 'none';
                element.style.userSelect = 'none';
            } else {
                element.style.webkitUserSelect = 'auto';
                element.style.userSelect = 'auto';
            }
        });
    } else {
        alert("You're not in a service-now.com instance");
    }
})();