'use client';

import { useState, useEffect } from 'react';
import { database, auth } from '../../../utils/supabase';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function ContactSubmissionsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { user, error } = await auth.getCurrentUser();
      if (!user) {
        router.push('/admin');
        return;
      }
      
      setIsAuthenticated(true);
      fetchSubmissions();
    };

    checkAuth();
  }, [router]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await database.getContactSubmissions();
      if (error) throw error;
      
      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching contact submissions:', err);
      setError('Failed to load contact submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await database.updateContactSubmissionStatus(id, status);
      if (error) throw error;
      
      // Update local state
      setSubmissions(submissions.map(sub => 
        sub.id === id ? { ...sub, status } : sub
      ));
      
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      const { error } = await database.deleteContactSubmission(id);
      if (error) throw error;
      
      // Update local state
      setSubmissions(submissions.filter(sub => sub.id !== id));
      
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
      setError('Failed to delete submission');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Contact Form Submissions</h1>
        <button 
          onClick={() => router.push('/admin')} 
          className={styles.backButton}
        >
          Back to Dashboard
        </button>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.contentGrid}>
        <div className={styles.submissionsList}>
          <h2>All Submissions ({submissions.length})</h2>
          
          {submissions.length === 0 ? (
            <p className={styles.emptyState}>No contact form submissions yet.</p>
          ) : (
            <div className={styles.submissionsTable}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(submission => (
                    <tr 
                      key={submission.id} 
                      className={`${styles.submissionRow} ${selectedSubmission?.id === submission.id ? styles.selected : ''}`}
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <td>{formatDate(submission.created_at)}</td>
                      <td>{submission.name}</td>
                      <td className={styles.subjectCell}>{submission.subject}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[submission.status]}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className={styles.actionsCell}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSubmission(submission.id);
                          }}
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {selectedSubmission && (
          <div className={styles.submissionDetail}>
            <h2>Submission Details</h2>
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <h3>{selectedSubmission.subject}</h3>
                <div className={styles.detailMeta}>
                  <p><strong>From:</strong> {selectedSubmission.name} ({selectedSubmission.email})</p>
                  <p><strong>Date:</strong> {formatDate(selectedSubmission.created_at)}</p>
                </div>
              </div>
              
              <div className={styles.statusActions}>
                <span>Status: </span>
                <div className={styles.statusButtons}>
                  <button 
                    className={`${styles.statusButton} ${selectedSubmission.status === 'new' ? styles.active : ''}`}
                    onClick={() => updateStatus(selectedSubmission.id, 'new')}
                  >
                    New
                  </button>
                  <button 
                    className={`${styles.statusButton} ${selectedSubmission.status === 'read' ? styles.active : ''}`}
                    onClick={() => updateStatus(selectedSubmission.id, 'read')}
                  >
                    Read
                  </button>
                  <button 
                    className={`${styles.statusButton} ${selectedSubmission.status === 'replied' ? styles.active : ''}`}
                    onClick={() => updateStatus(selectedSubmission.id, 'replied')}
                  >
                    Replied
                  </button>
                </div>
              </div>
              
              <div className={styles.messageContent}>
                <h4>Message:</h4>
                <div className={styles.messageText}>
                  {selectedSubmission.message.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
              
              <div className={styles.detailActions}>
                <a 
                  href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}
                  className={styles.replyButton}
                >
                  Reply via Email
                </a>
                <button 
                  onClick={() => deleteSubmission(selectedSubmission.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
