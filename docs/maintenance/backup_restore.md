# Backup and Restore Procedures for Mint Replica

This document provides comprehensive instructions for backing up and restoring data in the Mint Replica application. It covers procedures for both regular backups and disaster recovery scenarios.

## Introduction

Regular backups and a robust restore process are critical components of maintaining the Mint Replica application. These procedures ensure data integrity, minimize downtime in case of failures, and provide a safety net for recovering from various scenarios, including data corruption, hardware failures, or security incidents.

## Backup Procedures

### Database Backups

#### PostgreSQL Backups

1. Frequency: Daily full backups, hourly incremental backups
2. Retention: Keep daily backups for 30 days, monthly backups for 1 year
3. Backup command:
   ```
   pg_dump -Fc -d mint_replica > /path/to/backup/mint_replica_$(date +%Y%m%d_%H%M%S).dump
   ```
4. Verify backup integrity:
   ```
   pg_restore -l /path/to/backup/mint_replica_YYYYMMDD_HHMMSS.dump
   ```

#### MongoDB Backups

1. Frequency: Daily full backups
2. Retention: Keep backups for 30 days
3. Backup command:
   ```
   mongodump --uri="mongodb://username:password@host:port/mint_replica" --out=/path/to/backup/mongo_$(date +%Y%m%d_%H%M%S)
   ```
4. Verify backup integrity:
   ```
   mongorestore --dry-run --uri="mongodb://username:password@host:port/mint_replica" /path/to/backup/mongo_YYYYMMDD_HHMMSS
   ```

### File System Backups

1. Backup critical configuration files:
   - `/etc/mint-replica/config.json`
   - `/etc/nginx/sites-available/mint-replica.conf`
2. Backup application logs:
   - `/var/log/mint-replica/`
3. Use rsync for incremental backups:
   ```
   rsync -avz --delete /path/to/mint-replica/data /path/to/backup/filesystem_$(date +%Y%m%d_%H%M%S)
   ```

### Automated Backup Scripts

1. Location: `/opt/mint-replica/scripts/backup/`
2. Main backup script: `run_backups.sh`
3. Cron job setup:
   ```
   0 1 * * * /opt/mint-replica/scripts/backup/run_backups.sh
   ```
4. Logging: All backup operations are logged to `/var/log/mint-replica/backups.log`

## Backup Storage

1. Encryption: Use GPG to encrypt sensitive backups
   ```
   gpg --encrypt --recipient backup@mintreplicaapp.com /path/to/backup/mint_replica_YYYYMMDD_HHMMSS.dump
   ```
2. Off-site storage: 
   - Use AWS S3 with versioning enabled
   - Sync backups daily:
     ```
     aws s3 sync /path/to/backup/ s3://mint-replica-backups/
     ```
3. Cloud storage:
   - Use Google Cloud Storage as a secondary backup location
   - Set up lifecycle policies to archive older backups to cold storage

## Restore Procedures

### Database Restoration

#### PostgreSQL Restoration

1. Stop the application services
2. Drop the existing database:
   ```
   dropdb mint_replica
   ```
3. Create a new database:
   ```
   createdb mint_replica
   ```
4. Restore from backup:
   ```
   pg_restore -d mint_replica /path/to/backup/mint_replica_YYYYMMDD_HHMMSS.dump
   ```

#### MongoDB Restoration

1. Stop the application services
2. Drop the existing database:
   ```
   mongo mint_replica --eval "db.dropDatabase()"
   ```
3. Restore from backup:
   ```
   mongorestore --uri="mongodb://username:password@host:port/mint_replica" /path/to/backup/mongo_YYYYMMDD_HHMMSS
   ```

### File System Restoration

1. Restore configuration files:
   ```
   rsync -avz /path/to/backup/filesystem_YYYYMMDD_HHMMSS/etc/mint-replica/ /etc/mint-replica/
   rsync -avz /path/to/backup/filesystem_YYYYMMDD_HHMMSS/etc/nginx/ /etc/nginx/
   ```
2. Restore application data:
   ```
   rsync -avz /path/to/backup/filesystem_YYYYMMDD_HHMMSS/var/mint-replica/ /var/mint-replica/
   ```

### Application State Verification

1. Database integrity check:
   - Run PostgreSQL VACUUM ANALYZE
   - Check MongoDB collections for consistency
2. Configuration validation:
   - Verify all required configuration files are present and correctly formatted
3. Application startup:
   - Start all services and check logs for any errors
4. Functionality testing:
   - Run automated test suite
   - Perform manual smoke tests on critical features

## Disaster Recovery

1. Assess the extent of the disaster and its impact on the system
2. Retrieve the latest off-site backups
3. Provision new infrastructure if necessary (use Terraform scripts in `/infrastructure/terraform/`)
4. Follow the database and file system restoration procedures
5. Update DNS records if using new infrastructure
6. Perform thorough testing before redirecting user traffic

## Testing Backups

1. Schedule quarterly backup restoration drills
2. Create a separate testing environment for restoration tests
3. Verify data integrity and application functionality post-restoration
4. Document and address any issues encountered during the drill

## Security Considerations

1. Encrypt backups both at rest and in transit
2. Use strong, regularly rotated encryption keys
3. Implement least-privilege access controls for backup storage
4. Regularly audit access logs for backup systems

## Compliance

1. Ensure backup and restore procedures comply with:
   - GDPR requirements for data protection
   - PCI DSS standards for financial data handling
   - SOC 2 requirements for data availability and confidentiality
2. Maintain detailed logs of all backup and restore operations
3. Regularly review and update procedures to align with changing regulations

## Troubleshooting

1. Backup failure:
   - Check disk space and network connectivity
   - Verify credentials for backup destinations
   - Review backup logs for specific error messages
2. Restore failure:
   - Ensure compatibility between backup version and target system
   - Verify integrity of backup files
   - Check for any conflicting data or schema changes

## Related Documents

- [Database Administration Guide](/docs/database/admin_guide.md)
- [Security Policies](/docs/security/policies.md)
- [Disaster Recovery Plan](/docs/maintenance/disaster_recovery.md)
- [Compliance Documentation](/docs/legal/compliance.md)

<!-- Human Tasks -->
<!--
1. Review and approve the backup and restore procedures
2. Implement and test the automated backup scripts
3. Conduct a full disaster recovery drill
4. Verify compliance of backup and restore procedures with relevant regulations
-->