import _ from 'lodash'

export const GetTypeAHead = (queryType) => {
  var filtered = _.map(GetQueryTypes() , f => { if (f.cameleCase === queryType) return f } )
  filtered = _.without(filtered, undefined)
  return filtered[0].fields || []
}



export const GetQueryTypes = () => {
  return [
    { queryType: "AgentRestorePoint", cameleCase: 'agentRestorePoint', fields: []},
    { queryType: "AgentBackupJob", cameleCase: 'agentBackupJob', fields: [] },

    { queryType: "AgentProtectionGroup", cameleCase: 'agentProtectionGroup',
      fields: [
        { name: 'Name', type: 'string' },
        { name: 'RescanScheduleEnabled', type: 'boolean' },
        { name: 'Type', type: 'string' },
        { name: 'UID', type: 'string' },
      ]
    },
    { queryType: "DiscoveredComputer", cameleCase: 'discoveredComputer', fields: [] },
    { queryType: "BackupServer", cameleCase: 'backupServer' ,
      fields: [
        { name: 'Description', type: 'string' },
        { name: 'Name', type: 'string' },
        { name: 'Port', type: 'string' },
        { name: 'Type', type: 'string' },
        { name: 'UID', type: 'string' },
        { name: 'Version', type: 'string' },
      ]
    },
    { queryType: "Repository", cameleCase: 'repository',
      fields: [
        { name: 'Capacity', type: 'number' },
        { name: 'FreeSpace', type: 'number' },
        { name: 'Kind', type: 'string' },
        { name: 'Name', type: 'string' },
        { name: 'Type', type: 'string' },
        { name: 'UID', type: 'string' },
      ]
    },
    { queryType: "Job", cameleCase: 'job',
      fields: [
        { name: 'Description', type: 'string' },
        { name: 'JobType', type: 'string' },
        { name: 'Name', type: 'string' },
        { name: 'NextRun', type: 'datetime' },
        { name: 'Platform', type: 'string' },
        { name: 'ScheduleConfigured', type: 'boolean' },
        { name: 'ScheduleEnabled', type: 'boolean' },
        { name: 'Type', type: 'string' },
        { name: 'UID', type: 'string' },
      ]
    },
    { queryType: "Backup", cameleCase: 'backup',
      fields: [
        { name: 'BackupType', type: 'string' },
        { name: 'Name', type: 'string' },
        { name: 'Platform', type: 'string' },
        { name: 'Type', type: 'string' },
        { name: 'UID', type: 'string' },
      ]
    },
    { queryType: "BackupFile", cameleCase: 'backupFile',
      fields: [
        { name: 'BackupSize', type: 'numeric' },
        { name: 'CompressRatio', type: 'numeric' },
        { name: 'CreationTime', type: 'datetime' },
        { name: 'DataSize', type: 'numeric' },
        { name: 'DeduplicationRatio', type: 'numeric' },
        { name: 'FilePath', type: 'string' },
        { name: 'FileType', type: 'string' },
        { name: 'Name', type: 'string' },
        { name: 'Type', type: 'string' },
        { name: 'UID', type: 'string' },
      ]
    },
    { queryType: "FailoverPlan", cameleCase: 'failoverPlan',
        fields: []
    },
    { queryType: "RestorePoint", cameleCase: 'restorePoint',
      fields: [
        { name: 'BackupDate', type: 'datetime' },
        { name: 'Name', type: 'string' },
        { name: 'Type', type: 'string' },
        { name: 'UID', type: 'string' },
      ]
    },
    { queryType: "VmRestorePoint", cameleCase: 'vmRestorePoint',
      fields: [
        { name: 'Algorithm', type: 'string' },
        { name: 'CreationTime', type: 'string' },
        { name: 'HierarchyObjRef', type: 'string' },
        { name: 'Name', type: 'string' },
        { name: 'PointType', type: 'string' },
        { name: 'Type', type: 'string' },
        { name: 'UID', type: 'string' },
        { name: 'VmDisplayName', type: 'string' },
        { name: 'VmName', type: 'string' },
      ]
    },
    { queryType: "vAppRestorePoint", cameleCase: 'vAppRestorePoint', fields: [] },
    { queryType: "Replica", cameleCase: 'replica', fields: [] },
    { queryType: "VmReplicaPoint", cameleCase: 'vmReplicaPoint', fields: [] },
    { queryType: "HierarchyRoot", cameleCase: 'hierarchyRoot',
      fields: [
        { name: 'HierarchyRootId', type: 'string' },
        { name: 'HostType', type: 'string' },
        { name: 'Name', type: 'string' },
        { name: 'Type', type: 'string' },
        { name: 'UID', type: 'string' },
        { name: 'UniqueId', type: 'string' },
      ]
    },
    { queryType: "ManagedServer", cameleCase: 'managedServer',
      fields: [
        { name: 'Description', type: 'string' },
        { name: 'ManagedServerType', type: 'string' },
        { name: 'Name', type: 'string' },
        { name: 'Type', type: 'string' },
        { name: 'UID', type: 'string' },
      ]
    },
    { queryType: "BackupJobSession", cameleCase: 'backupJobSession',
      fields: [
        { name: 'CreationTime', type: 'datetime' },
        { name: 'EndTime', type: 'datetime' },
        { name: 'JobSessionUid', type: 'string' },
        { name: 'Name', type: 'string' },
        { name: 'Reason', type: 'string' },
        { name: 'Result', type: 'string' },
        { name: 'State', type: 'string' },
        { name: 'TotalSize', type: 'numeric' },
        { name: 'Type', type: 'string' },
        { name: 'UID', type: 'string' },
        { name: 'VmDisplayName', type: 'string' },
      ]
    },
    { queryType: "ReplicaJobSession", cameleCase: 'replicaJobSession', fields: [] },
    { queryType: "RestoreSession", cameleCase: 'restoreSession', fields: [] },
    { queryType: "BackupTaskSession", cameleCase: 'backupTaskSession',
      fields: [
        { name: 'CreationTime', type: 'datetime' },
        { name: 'EndTime', type: 'datetime' },
        { name: 'JobSessionUid', type: 'string' },
        { name: 'Name', type: 'string' },
        { name: 'Reason', type: 'string' },
        { name: 'Result', type: 'string' },
        { name: 'State', type: 'string' },
        { name: 'TotalSize', type: 'numeric' },
        { name: 'Type', type: 'string' },
        { name: 'UID', type: 'string' },
        { name: 'VmDisplayName', type: 'string' },
      ]
    },
    { queryType: "ReplicaTaskSession", cameleCase: 'replicaTaskSession', fields: [] },
    { queryType: "WanAccelerator", cameleCase: 'wanAccelerator', fields: [] },
    { queryType: "VCloudOrganizationConfig", cameleCase: 'vCloudOrganizationConfig', fields: [] },
    { queryType: "VsphereSelfServiceConfig", cameleCase: 'vsphereSelfServiceConfig', fields: [] },
    { queryType: "CloudGateway", cameleCase: 'cloudGateway', fields: [] },
    { queryType: "CloudGatewayPool", cameleCase: 'cloudGatewayPool', fields: [] },
    { queryType: "CloudTenant", cameleCase: 'cloudTenant', fields: [] },
    { queryType: "CloudSubtenant", cameleCase: 'cloudSubtenant', fields: [] },
    { queryType: "CloudHardwarePlan", cameleCase: 'cloudHardwarePlan', fields: [] },
    { queryType: "CloudPublicIpAddress", cameleCase: 'cloudPublicIpAddress', fields: [] },
    { queryType: "CloudFailoverPlan", cameleCase: 'cloudFailoverPlan', fields: [] },
    { queryType: "CloudVmReplicaPoint", cameleCase: 'cloudVmReplicaPoint', fields: [] },
    { queryType: "CloudReplica", cameleCase: 'cloudReplica', fields: [] },
    { queryType: "VlanConfiguration", cameleCase: 'vlanConfiguration', fields: [] },
    { queryType: "CloudFailoverSession", cameleCase: 'cloudFailoverSession', fields: [] },
    { queryType: "ObjectInJob", cameleCase: 'objectInJob',
      fields: [
        { name: 'DisplayName', type: 'string' },
        { name: 'HierarchyObjRef', type: 'string' },
        { name: 'Name', type: 'string' },
        { name: 'ObjectInJobId', type: 'string' },
        { Order: 'Type', type: 'numeric' },
      ]
    },
    { queryType: "Task", cameleCase: 'task', fields: [] },
    { queryType: "Credentials", cameleCase: 'credentials',
      fields: [
        { name: 'Description', type: 'string' },
        { name: 'Id', type: 'string' },
        { name: 'Type', type: 'string' },
        { name: 'Username', type: 'string' },
      ]
    },
    { queryType: "Passwords", cameleCase: 'passwords', fields: [] },
  ]
}
