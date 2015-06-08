tvheadend.tvhlog = function(panel, index) {
    /*
     * Basic Config
     */
    var confreader = new Ext.data.JsonReader({
        root: 'config'
    }, ['tvhlog_path', 'tvhlog_dbg_syslog', 'tvhlog_trace_on',
        'tvhlog_debug', 'tvhlog_trace', 'tvhlog_libav']);

    /* ****************************************************************
     * Form Fields
     * ***************************************************************/

    var tvhlogLogPath = new Ext.form.TextField({
        fieldLabel: 'Debug log path',
        name: 'tvhlog_path',
        allowBlank: true,
        width: 400
    });

    var tvhlogToSyslog = new Ext.form.Checkbox({
        name: 'tvhlog_dbg_syslog',
        fieldLabel: 'Debug to syslog'
    });

    var tvhlogTraceOn = new Ext.form.Checkbox({
        name: 'tvhlog_trace_on',
        fieldLabel: 'Debug trace (low-level stuff)'
    });

    var tvhlogDebugSubsys = new Ext.form.TextField({
        fieldLabel: 'Debug subsystems',
        name: 'tvhlog_debug',
        allowBlank: true,
        width: 400
    });

    var tvhlogTraceSubsys = new Ext.form.TextField({
        fieldLabel: 'Trace subsystems',
        name: 'tvhlog_trace',
        allowBlank: true,
        width: 400
    });

    var tvhlogLibav = new Ext.form.Checkbox({
        name: 'tvhlog_libav',
        fieldLabel: 'Debug libav log'
    });


    /* ****************************************************************
     * Form
     * ***************************************************************/

    var saveButton = new Ext.Button({
        text: "Apply configuration (run-time only)",
        tooltip: 'Apply changes made bellow to the run-time configuration<br/>They will be lost on restart.',
        iconCls: 'apply',
        handler: saveChanges
    });

    var helpButton = new Ext.Button({
        text: 'Help',
		iconCls: 'help',
        handler: function() {
            new tvheadend.help('Debug Configuration', 'config_tvhlog.html');
        }
    });

    items = new Array();
    items.push(tvhlogLogPath);
    items.push(tvhlogToSyslog);
    if (tvheadend.capabilities.indexOf('trace') !== -1)
      items.push(tvhlogTraceOn);
    items.push(tvhlogDebugSubsys);
    if (tvheadend.capabilities.indexOf('trace') !== -1)
      items.push(tvhlogTraceSubsys);
    if (tvheadend.capabilities.indexOf('libav') !== -1)
      items.push(tvhlogLibav);

    var DebuggingPanel = new Ext.form.FieldSet({
        title: 'Debugging Options',
        width: 700,
        autoHeight: true,
        collapsible: true,
        animCollapse : true,
        items: items
    });

    var confpanel = new Ext.form.FormPanel({
        title: 'Debugging',
        iconCls: 'debug',
        border: false,
        bodyStyle: 'padding:15px',
        labelAlign: 'left',
        labelWidth: 200,
        waitMsgTarget: true,
        reader: confreader,
        layout: 'form',
        defaultType: 'textfield',
        autoHeight: true,
        items: [DebuggingPanel],
        tbar: [saveButton, '->', helpButton]
    });

    /* ****************************************************************
     * Load/Save
     * ***************************************************************/

    confpanel.on('render', function() {
        confpanel.getForm().load({
            url: 'tvhlog',
            params: {
                op: 'loadSettings'
            },
            success: function(form, action) {
                confpanel.enable();
            }
        });
    });

    function saveChanges() {
        confpanel.getForm().submit({
            url: 'tvhlog',
            params: {
                op: 'saveSettings'
            },
            waitMsg: 'Applying Data...',
            failure: function(form, action) {
                Ext.Msg.alert('Apply failed', action.result.errormsg);
            }
        });
    }

    tvheadend.paneladd(panel, confpanel, index);
};
