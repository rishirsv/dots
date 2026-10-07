export const kit = "report";

export default function(h) {
  const {page,section,html,review,reviewPoint,decision,editableCode,disclosure,
    implementationSteps,walkthrough,mockup,table,callout,sequence,code} = h;
  const p = text => html`<p>${text}</p>`;
  const list = items => html`<ul>${items.map(item=>html`<li>${item}</li>`)}</ul>`;
  const screen = (name, label, content) => mockup({
    label,
    caption:{lead:"Concept — not observed UI.",text:"Illustrative PostBox layout and copy."},
    content:html`<div class="postbox-concept"><div class="postbox-topbar"><span>PostBox</span><strong>${name}</strong></div>${content}</div>`
  });
  return page({
    title:"Send Later for PostBox",
    context:"PostBox / implementation proposal",
    dek:"Choose when a message should leave, manage it in Scheduled, and recover clearly if sending fails.",
    layout:"article", tools:true,
    footer:"Proposal based on the requested behavior. No PostBox repository was supplied; all contracts and module boundaries below are proposed."
  },[
    html`<style>
      .postbox-concept { padding:20px; font-size:14px; line-height:1.5; }
      .postbox-concept p { margin:0; }
      .postbox-topbar { display:flex; align-items:center; justify-content:space-between; gap:12px; padding-bottom:12px; border-bottom:1px solid var(--a12); }
      .postbox-topbar span { color:var(--text-muted); }
      .postbox-message { padding:14px 0; }
      .postbox-message .postbox-recipient { color:var(--text-muted); font-size:13px; margin-bottom:6px; }
      .postbox-message .postbox-subject { font-size:21px; font-weight:600; letter-spacing:-.6px; }
      .postbox-message .postbox-body { margin-top:10px; }
      .postbox-schedule { display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:16px; border-top:1px solid var(--a20); padding-top:14px; }
      .postbox-time { display:block; font-size:32px; font-weight:600; line-height:1.2; letter-spacing:-1px; color:var(--accent-deep); }
      .postbox-date { display:block; margin-top:3px; }
      .postbox-zone { display:block; color:var(--text-muted); font-size:12px; }
      .postbox-action { display:inline-block; padding:8px 14px; border-radius:var(--r-inline); color:var(--background); background:var(--accent); font-weight:600; white-space:nowrap; }
      .postbox-actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:14px; }
      .postbox-secondary { display:inline-block; padding:7px 12px; border:1px solid var(--a20); border-radius:var(--r-inline); }
      .postbox-status { display:flex; align-items:center; gap:8px; font-weight:600; margin-top:12px; }
      .postbox-status-mark { width:8px; height:8px; border-radius:50%; background:var(--a55); }
      .postbox-help { border-top:1px solid var(--a12); padding-top:12px; margin-top:14px !important; font-size:13px; color:var(--text-muted); }
      .postbox-failure { color:var(--danger-ink); font-size:23px; font-weight:600; letter-spacing:-.5px; }
      @media (max-width:400px) { .postbox-concept { padding:16px; } .postbox-time { font-size:29px; } }
    </style>`,
    walkthrough({id:"send-later-experience",label:"The Send Later experience",steps:[
      {title:"Choose a time",body:[screen("New message","Concept: Project update to Morgan, scheduled for October 12 at 9 AM America/Toronto, with Confirm time as the chosen action.",html`
        <div class="postbox-message"><p class="postbox-recipient">To: Morgan</p><p class="postbox-subject">Project update</p><p class="postbox-body">Here is the update for our next meeting.</p></div>
        <div class="postbox-schedule"><div><span class="postbox-time">9:00 AM</span><span class="postbox-date">October 12</span><span class="postbox-zone">America/Toronto</span></div><span class="postbox-action">Confirm time</span></div>
        <p class="postbox-help">Send Later saves this message in Scheduled.</p>`)]},
      {title:"Wait in Scheduled",body:[screen("Scheduled","Concept: Queued Project update to Morgan, due October 12 at 9 AM America/Toronto. Change time and Cancel schedule are available.",html`
        <div class="postbox-message"><p class="postbox-subject">Project update</p><p class="postbox-recipient">To: Morgan</p></div>
        <div class="postbox-schedule"><div><span class="postbox-time">9:00 AM</span><span class="postbox-date">October 12</span><span class="postbox-zone">America/Toronto</span></div><div class="postbox-status"><span class="postbox-status-mark"></span>Queued</div></div>
        <div class="postbox-actions"><span class="postbox-secondary">Change time</span><span class="postbox-secondary">Cancel schedule</span></div>
        <p class="postbox-help">PostBox sends it even if this device is closed.</p>`)]},
      {title:"Sending starts",body:[screen("Scheduled","Concept: Project update to Morgan is Sending. Time changes and cancellation are closed.",html`
        <div class="postbox-message"><p class="postbox-subject">Project update</p><p class="postbox-recipient">To: Morgan</p></div>
        <div class="postbox-status"><span class="postbox-status-mark"></span>Sending</div>
        <p class="postbox-help">Sending has started. It is too late to change the time or cancel.</p>`)]},
      {title:"If it fails",body:[screen("Scheduled","Concept: Project update was not sent because the mail service could not be reached. The content is saved. Retry now, choose another time, or cancel.",html`
        <div class="postbox-message"><p class="postbox-subject">Project update</p><p class="postbox-recipient">To: Morgan</p></div>
        <p class="postbox-failure">Not sent</p><p>Could not reach the mail service. Your message is saved.</p>
        <div class="postbox-actions"><span class="postbox-action">Retry now</span><span class="postbox-secondary">Choose another time</span><span class="postbox-secondary">Cancel schedule</span></div>
        <p class="postbox-help">Retry appears only when PostBox knows the message was not accepted.</p>`)]},
      {title:"When it sends",body:[screen("Sent","Concept: Project update to Morgan has moved to Sent after mail-service acceptance and is removed from active Scheduled.",html`
        <div class="postbox-message"><p class="postbox-subject">Project update</p><p class="postbox-recipient">To: Morgan</p></div>
        <div class="postbox-status"><span class="postbox-status-mark"></span>Sent</div>
        <p class="postbox-help">The mail service accepted this message. It leaves the active Scheduled list.</p>`)]}
    ]}),
    p("Change the time or cancel while the message is queued. If PostBox cannot tell whether the mail service accepted it, show ‘Checking whether this was sent’ and hold Retry until the result is known."),
    review({id:"postbox-send-later",title:"Send Later implementation plan",revision:"3"},[
    section("manage","Manage a scheduled message",[
      reviewPoint({id:"scope",title:"Normal Send and Drafts keep their behavior",summary:"Send still sends immediately. Drafts still save unfinished messages. Scheduling adds a separate, explicit action."},[
        list(["Add Send Later beside the existing Send action. Keep Send as the default action and preserve its current shortcut.","Only a successful server confirmation moves a message from the composer or Drafts into Scheduled. If saving fails, keep the message and explain that it has not been scheduled.","Scheduled stores the content and attachments confirmed by the person. Reading a scheduled message does not turn it into a draft. The first version supports time changes and cancellation; content editing requires cancellation first."]),
        p("The confirmed message and attachments wait together. A chosen time is when sending should start; network delays can make the send later. Sent means the mail service accepted the message, not that the recipient read or received it."),
        disclosure("Proposed integration boundaries",[
          p("First inspect the real composer, Drafts, immediate-send pipeline, Sent records, mail provider, authentication, and attachment lifetime. Reuse existing validation and send preparation where behavior matches. Add a scheduling entry point without changing the immediate-send path."),
          table({columns:["Proposed boundary","Responsibility"],rows:[
            ["Composer schedule action","Collect time, show confirmation, submit schedule request, preserve composition on error."],
            ["Schedule service","Authorize every request, validate content and time, atomically store the snapshot and queue record, list and mutate schedules."],
            ["Durable dispatcher","Find due records, atomically claim a record, call the existing mail adapter, recover interrupted attempts."],
            ["Mail adapter","Expose provider acceptance, deduplication and status lookup, and classify failures."],
            ["Scheduled view","Read authoritative states, display due times and errors, offer only actions valid for that state."]
          ]}),
          p("These are roles to map onto existing code after inspection, not new files that are known to exist. Engineering owners and provider capabilities remain to be established.")
        ])
      ]),
      reviewPoint({id:"scheduled-view",title:"Every message has a visible state and valid next action",summary:"People can see what is waiting, what is already sending, and what needs their attention."},[
        p("Queued messages show the recipient, subject, due date, time, and zone. Order them by due time. Keep failed or uncertain messages in a clearly labeled attention group above the queue."),
        table({columns:["State","What people can do"],rows:[
          ["Queued","Change the time or cancel before sending starts."],
          ["Sending","Read the status; time changes and cancellation are closed."],
          ["Failed, known not sent","Retry now, choose another time, or cancel. Reconnect the account first if its connection expired."],
          ["Checking whether this was sent","Wait for reconciliation. Retry is unavailable because it could send a duplicate."],
          ["Sent","Find the message in Sent through the existing PostBox flow."]
        ]}),
        p("If the mail service rejected the content or recipients, explain that the person must cancel to edit the saved message. If another device has changed the message, show its current state and explain why the attempted action is unavailable. Never report cancellation success just because the person clicked Cancel."),
        disclosure("How the view stays accurate",[
          p("Fetch server state when Scheduled opens and after every action. Keep a message visible during dispatch; move it to Sent only after provider acceptance."),
          list(["Use the same server schedule identity on every device. Authorize list and detail reads by account and message ownership.","Return state and version with every response. A stale action receives a conflict and current state, then the view refreshes.","Keep failed and uncertain records until the person recovers or cancels them. Record provider acceptance separately from delivery failures handled by existing PostBox behavior.","Provide accessible status text, keyboard actions, focus after dialogs, and error announcements. Never rely on color alone."])
        ])
      ])
    ]),
    section("timing","Timing and changes",[
      reviewPoint({id:"time-contract",title:"Confirm the time zone and preserve the chosen moment",summary:"A message scheduled for 9:00 AM in Toronto still leaves at that chosen moment if the sender travels to London."},[
        p("Recommended behavior: default the picker to the device’s current named time zone, show that zone beside the time, and let the person change it before confirmation. Store one exact moment. Travel and device zone changes must not silently move the send time."),
        table({columns:["Example","What the person sees"],rows:[
          ["Schedule October 12, 9:00 AM in America/Toronto","Confirmation shows the full date, 9:00 AM, and America/Toronto."],
          ["Open Scheduled in London","Show the local equivalent, 2:00 PM, with Europe/London; also show the original 9:00 AM America/Toronto time."],
          ["A clock change creates a missing local time","Reject that time and ask for another valid time. Do not silently shift it."],
          ["A clock change repeats a local time","Show the two occurrences with their UTC offsets and require the person to choose one."]
        ]}),
        p("If a message becomes overdue during a service interruption, people need predictable behavior when service returns. The proposed default below prevents a much later message from leaving unexpectedly."),
        decision({id:"overdue-policy",question:"What should happen when service returns after a missed send time?",recommended:"bounded",options:[
          {value:"bounded",label:"Send within a short window; ask after that",consequence:"Recommended initial window: 24 hours. Beyond it, show ‘Missed send time’ and offer Send now or a new time. A long outage cannot trigger a stale message silently."},
          {value:"always",label:"Send as soon as service returns",consequence:"The message eventually sends automatically, even after a long delay. Scheduled must explain the delay."}
        ]}),
        disclosure("Proposed time validation and storage",[
          list(["Submit the local date and time, an IANA zone such as America/Toronto, and the selected UTC offset when the local time repeats. Resolve with a timezone-aware library and validate on the server.","Store due_at as a UTC instant, plus the original zone and local-time presentation. The stored instant is authoritative; timezone database updates do not change already confirmed schedules.","Reject past times according to the server clock, including a time that passed while the dialog was open. Return the refreshed time instead of sending immediately. Reject invalid recipients, incomplete uploads, or invalid messages using normal send validation.","Use the same rules for a time change. Do not add an arbitrary maximum scheduling horizon until attachment retention and provider constraints are known; show an explicit limit if those constraints require one.","Keep queued attachments available until a terminal result or cancellation. Secure stored content under existing message access and retention policies. Validate current account authorization again before dispatch."])
        ])
      ]),
      reviewPoint({id:"cancel-boundary",title:"Cancel before sending starts",summary:"If cancellation wins, no send starts. If sending wins, PostBox says cancellation is too late."},[
        p("Sending starts when PostBox takes the queued message to send. The message may not yet have reached the mail service, but cancellation is closed. If Cancel and Sending happen together, PostBox reports the server’s actual result; the order of clicks on a device cannot settle the outcome."),
        p("A time change follows the same boundary. If the change wins, the old due time cannot send the message. If dispatch already won, explain that the time cannot be changed because sending started."),
        decision({id:"cancel-destination",question:"Where should a cancelled message go?",recommended:"draft",options:[
          {value:"draft",label:"Return the message to Drafts",consequence:"The person keeps the content and attachments, can edit it, and can send or schedule again."},
          {value:"delete",label:"Discard it after confirmation",consequence:"Cancel becomes destructive. Add a confirmation that explicitly says the message will be deleted."}
        ]}),
        disclosure("How cancellation and rescheduling remain atomic",[
          p("The precise cancellation boundary is the atomic Queued → Sending transition on the server."),
        sequence({actors:["Person","Schedule service","Dispatcher"],events:[
          {from:"Person",to:"Schedule service",label:"Cancel queued message"},
          {from:"Dispatcher",to:"Schedule service",label:"Claim due message"},
          {from:"Schedule service",to:"Person",label:"One wins; return current state"}
        ],summary:"Cancel and dispatch compete for the same queued record. One atomic state change wins. Cancel success prevents dispatch; a successful claim makes cancellation too late."}),
          list(["Cancel updates only a queued, waiting-to-retry, or known-unsent failed record with no active attempt, using the expected version. The worker claims only queued records whose due time has arrived or retrying records whose next attempt is due. Both transitions must use a transaction or compare-and-swap on the same durable row.","For the recommended Drafts result, cancel and create/restore the draft in one transaction, or use a durable reconciliation step if Drafts is in a separate service. A reported cancellation must not lose content.","A time change increments the version and changes due_at atomically. If a separate job queue exists, enqueue a new wake-up through a durable outbox and make old jobs check state, version and current due_at before claiming.","Treat repeated cancel requests as the same result. Allow a safe retry after network loss. A stale or already-sending request returns conflict and authoritative state.","Do not claim future messages in advance. Claiming early would close cancellation before the confirmed time."])
        ])
      ])
    ]),
    section("reliability","Reliable sending and release",[
      reviewPoint({id:"duplicate-prevention",title:"A retry continues the same send operation",summary:"Repeated clicks, repeated jobs, and crashes must not create another copy of the message."},[
        p("PostBox must distinguish ‘not sent’ from ‘we do not yet know.’ A network timeout can happen after the mail service accepted the message. In that case, PostBox checks the result before offering a new attempt. The mail provider’s deduplication or status lookup is a release prerequisite for safe automatic recovery."),
        decision({id:"retry-policy",question:"Should known temporary failures retry automatically?",recommended:"automatic",options:[
          {value:"automatic",label:"Retry briefly, then show a failure",consequence:"Retry confirmed-unsent transient failures with a bounded backoff. Show ‘Retrying’ and the next attempt time. After the limit, let the person retry manually or choose another time."},
          {value:"manual",label:"Ask the person for every retry",consequence:"Show a clear failure immediately. The person controls the next attempt, but temporary outages need more attention."}
        ]}),
        disclosure("Proposed persistence and API contract",[
          p("The following text is an editable proposal, not code from an inspected repository. Map it onto PostBox’s existing types and persistence after inspection."),
          editableCode({id:"schedule-contract",title:"Proposed schedule contract",source:`Schedule record
  id, account_id, message_snapshot_id
  due_at_utc, original_zone, original_local_time
  state: queued | sending | retrying | failed | uncertain | sent | cancelled
  version, created_at, updated_at
  send_operation_id (stable provider deduplication key)
  attempt_count, next_attempt_at, lease_token, lease_expires_at
  provider_message_id, accepted_at, failure_code, failure_detail

Proposed actions (authenticated; owned account required)
  createSchedule(snapshot, time, client_request_id)
  listSchedules(account, cursor)
  reschedule(id, expected_version, new_time, client_request_id)
  cancelSchedule(id, expected_version, client_request_id)
  retrySchedule(id, expected_version, client_request_id)

create/reschedule/cancel/retry return authoritative state + version.
Repeated client_request_id returns the recorded result.
A stale version returns conflict + current state.
Retry is allowed only when provider non-acceptance is known.
Provider deduplication key stays stable across every delivery attempt.`}),
          list(["Write the schedule and durable wake-up together. A database due-record poller is the simplest candidate if the existing stack has no reliable job system. Do not rely on device timers or an in-memory timer.","Use a durable, atomic claim so two workers cannot start independent operations. If leases expire, a recovery worker resumes the same operation. A lease alone cannot prevent duplicates after a crash; provider deduplication must still apply.","Persist intent before contacting the provider. Retry the same provider idempotency key inside its supported lifetime, or reconcile by operation ID. Never mint a new key just because an HTTP request timed out.","Persist provider acceptance and finalize Sent through a durable reconciliation path. A crash after acceptance but before local recording must recover acceptance instead of sending again.","If the provider lacks sufficient deduplication and lookup, keep ambiguous results in Uncertain and require a confirmed operational resolution. Do not promise exactly-once delivery or enable automatic retries for ambiguous outcomes.","Classify permanent failures, temporary confirmed-unsent failures, and unknown outcomes. Use a proposed bounded retry policy of up to three attempts with increasing delay; tune only after provider constraints and overdue policy are approved. Stop automatic retries when their limit or the lateness window is reached.","Manual Retry now requests confirmation and preserves the send operation identity. Choosing another time requeues a confirmed-unsent message. If automatic recovery is waiting and no attempt is active, cancellation stops further attempts; an active attempt has the same ‘too late’ boundary."])
        ])
      ]),
      reviewPoint({id:"validation",title:"Prove what a person can trust",summary:"Release depends on accurate time handling, a decisive cancellation result, and safe recovery after interruption."},[
        p("Test the moments where trust can fail: a clock change, Cancel arriving as sending starts, two workers claiming one message, and a crash after the mail service accepts it. A duplicate acceptance or unresolved recovery defect blocks wider rollout."),
        disclosure("Acceptance checks for engineers",[
        table({columns:["Scenario","Required result"],rows:[
          ["Schedule succeeds; app closes; another device opens","The same message and exact due moment appear; server dispatch still runs."],
          ["Schedule request repeats after a network timeout","One schedule exists; the caller receives the original result."],
          ["Travel, clock-change gaps and repeated hours","The chosen instant stays fixed; invalid local times reject; repeated times require an explicit occurrence."],
          ["Time change races with an old wake-up","If the change wins, no send starts at the old time. Otherwise return Sending and explain the conflict."],
          ["Cancel and claim execute concurrently","Exactly one transition wins. Successful cancellation produces no provider request and preserves the chosen cancellation result."],
          ["Two workers or duplicated jobs","One operation claims the message; provider receives the stable key."],
          ["Crash before request, after acceptance, or before Sent is saved","Recovery reconciles the same operation; no second accepted message is created."],
          ["Provider rejects, times out, or account access expires","Show the correct recovery action; ambiguous results never expose unsafe Retry."],
          ["Delayed service restarts","Apply the approved overdue policy and show a clear missed-time result when appropriate."],
          ["Normal Send and Drafts regression","Immediate Send, shortcuts, saves, editing and current provider outcomes match their existing behavior."],
          ["Keyboard and assistive technology","The picker, Scheduled actions, conflict errors and status updates remain operable and announced."]
        ]}),
        ]),
        implementationSteps({title:"Implementation order",layout:"proof",steps:[
          {title:"Confirm dependencies",detail:"Inspect the real code and mail provider, and resolve the three product choices.",done:"Server dispatch, durable storage and provider recovery are verified."},
          {title:"Build the durable path",detail:"Add storage and authenticated actions, then claim, send and reconciliation.",done:"Focused concurrency and crash tests pass before scheduling is exposed."},
          {title:"Connect the experience",detail:"Add the picker and the Scheduled list.",done:"Time handling, errors and unchanged Send and Drafts behavior pass end to end."},
          {title:"Release gradually",detail:"Enable an internal cohort, then a limited cohort, then broader availability.",done:"The guarantees and observed reliability hold at each stage."}
        ]}),
        disclosure("Release controls",[
          p("Track due-to-dispatch delay, queue age, claim conflicts, provider acceptance, confirmed failures, uncertain outcomes, retries and duplicate reports. Correlate by schedule and operation ID; keep message bodies and recipients out of routine telemetry."),
          p("Set launch thresholds and alerting after establishing a baseline; no existing volume or performance measurements are available here. Exercise service interruption and restart before widening access. A duplicate acceptance or unresolved reconciliation defect blocks wider rollout."),
          p("Use separate controls for creating new schedules and dispatching existing ones. If the interface must be rolled back, stop new scheduling and continue servicing the existing queue with a management route. If dispatch itself is unsafe, pause claims, preserve records, show delays, and reconcile accepted sends before resuming. Never silently discard queued messages."),
          p("Validate storage migration and permissions before enabling the flag. Keep the additive data model readable during rollback. Scheduled attachments must retain their supported lifetime throughout rollout.")
        ])
      ]),
      callout.note("Ready after the choices and dependencies are confirmed.","The recommended proposal is to return cancellations to Drafts, hold messages missed by more than 24 hours for confirmation, and retry brief confirmed-unsent temporary failures. These defaults are proposals; the decision controls begin unanswered. Comments and edited contracts remain local until you copy or download one response.")
    ])
  ])]);
}
